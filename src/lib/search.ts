import { package_list, results_count, plone_versions, current_page, is_loading, has_more, total_found, search_sort } from "./stores";
import { default_sort } from "./settings";
import { get } from "svelte/store";
import { Client } from "typesense";
import { PUBLIC_SEARCH_PROTOCOL } from '$env/static/public';
import { PUBLIC_SEARCH_HOST } from '$env/static/public';
import { PUBLIC_SEARCH_PORT } from '$env/static/public';
import { PUBLIC_SEARCH_API_KEY } from '$env/static/public';
import { PUBLIC_SEARCH_COLLECTION } from '$env/static/public';

export const collectionName = PUBLIC_SEARCH_COLLECTION;
import type { VersionInfo, Filter } from '$lib/interfaces';

const PER_PAGE = 30;


export let searchClient = new Client({
  'nodes': [{
    'host': PUBLIC_SEARCH_HOST, // For Typesense Cloud use xxx.a1.typesense.net
    'port': parseInt(PUBLIC_SEARCH_PORT),      // For Typesense Cloud use 443
    'protocol': PUBLIC_SEARCH_PROTOCOL // For Typesense Cloud use https
  }],
  'apiKey': PUBLIC_SEARCH_API_KEY,
  'connectionTimeoutSeconds': 2
})



export function doSearch(
  term?: string,
  filter?: Filter,
  page: number = 1,
  append: boolean = false,
  sort: string = default_sort
) {
  // Guard against concurrent requests
  if (get(is_loading)) {
    return;
  }

  console.log(`filter: ${JSON.stringify(filter)}, page: ${page}, append: ${append}`)
  let classifiers = ["Framework :: Plone"];
  if (filter && filter.package_types.length > 0) {
    classifiers = filter.package_types;
  }
  if (term == "" && (filter && (filter.package_types == undefined && filter.plone_versions == undefined))) { return }
  if (filter && (filter.package_types != undefined || filter.plone_versions != undefined)) {
    term = term || "*"
  }

  let filterString = "";
  let baseFilterString = filterString;

  // build plone_versions filter string:
  if (filter && filter.plone_versions.length > 0) {
    if (filterString) {
      filterString += ' && ';
    }
    let fvFilterListString = ""
    filter.plone_versions.forEach((version, key, arr) => {
      fvFilterListString += `'${version}'`;
      if (!Object.is(arr.length - 1, key)) {
        fvFilterListString += ',';
      }
    });
    filterString += `framework_versions:=[${fvFilterListString}]`;
  }

  // build package_types filter string:
  if (filterString) {
    filterString += ' && ';
  }
  let ptFilterListString = ""
  classifiers.forEach((version, key, arr) => {
    ptFilterListString += `'${version}'`;
    if (!Object.is(arr.length - 1, key)) {
      ptFilterListString += ',';
    }
  });
  filterString += `classifiers:=[${ptFilterListString}]`;

  is_loading.set(true);

  let commonSearchParams = {
    'exclude_fields': 'description',
    'group_by': 'name_sortable',
    'group_limit': 1,
    'per_page': PER_PAGE,
    'page': page,
    'q': term,
    'collection': PUBLIC_SEARCH_COLLECTION
  }
  // Build sort_by: prepend _text_match:desc when search term is active for relevance
  const sortBy = term && term !== '*'
    ? `_text_match:desc,${sort},upload_timestamp:desc`
    : `${sort},upload_timestamp:desc`;

  let searchRequests = {
    'searches': [
      {
        'query_by': 'name,keywords,summary,description',
        'sort_by': sortBy,
        'facet_by': 'framework_versions,python_versions',
        'filter_by': filterString
      }
    ]
  }
  if (filter && filter.plone_versions.length > 0) {
    let facetSearch = {
      'query_by': 'name,keywords,summary,description',
      'facet_by': 'framework_versions,python_versions',
      'filter_by': baseFilterString
    }
    searchRequests.searches.push(facetSearch as any)
  }
  console.log("query:", searchRequests)
  searchClient.multiSearch.perform(searchRequests as any, commonSearchParams).then((searchResults: any) => {
    console.log(searchResults)
    if (searchResults === undefined) {
      is_loading.set(false);
      return;
    }

    const newHits = searchResults.results[0].grouped_hits || [];
    const foundTotal = searchResults.results[0].found;

    if (append) {
      // Append new results to existing list
      package_list.update(existing => [...existing, ...newHits]);
    } else {
      // Replace results
      package_list.set(newHits);
    }

    results_count.set(foundTotal);
    total_found.set(foundTotal);
    current_page.set(page);

    // Calculate if there are more results to load
    const currentCount = append ? get(package_list).length : newHits.length;
    has_more.set(currentCount < foundTotal);

    let facetResultsIndex: number = 0;
    if (searchResults.results.length === 2) {
      facetResultsIndex++;
    }

    searchResults.results[facetResultsIndex].facet_counts.forEach((facet: any) => {
      if (facet.field_name === 'framework_versions') {
        let versions: VersionInfo[] = [];
        facet.counts.forEach((version: VersionInfo) => {
          versions.push(version)
        })
        plone_versions.set(versions.sort(function (a, b) {
          var nameA = a.value.toUpperCase();
          var nameB = b.value.toUpperCase();
          if (nameA > nameB) {
            return -1;
          }
          if (nameA < nameB) {
            return 1;
          }
          return 0;
        }));
        console.log(versions)
      }
    });

    is_loading.set(false);
  }).catch((error: any) => {
    console.error("Search error:", error);
    is_loading.set(false);
  });
}

// Helper function to load the next page
export function loadMore(term?: string, filter?: Filter, sort?: string) {
  const nextPage = get(current_page) + 1;
  const currentSort = sort || get(search_sort);
  doSearch(term, filter, nextPage, true, currentSort);
}

// Helper function to reset pagination state
export function resetPagination() {
  current_page.set(1);
  has_more.set(true);
  total_found.set(0);
  package_list.set([]);
}
