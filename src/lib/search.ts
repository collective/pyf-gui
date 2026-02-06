import { PUBLIC_SEARCH_API_KEY, PUBLIC_SEARCH_COLLECTION, PUBLIC_SEARCH_HOST, PUBLIC_SEARCH_PORT, PUBLIC_SEARCH_PROTOCOL } from '$env/static/public';
import type { Filter, VersionInfo } from '$lib/interfaces';
import { Client } from "typesense";
import { default_sort, language_options, type Language } from "./settings";
import { searchState } from "./search-state.svelte";

export const collectionName = PUBLIC_SEARCH_COLLECTION;

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
  sort: string = default_sort,
  language?: Language
) {
  // Guard against concurrent requests
  if (searchState.isLoading) {
    return;
  }

  // Get current language from state if not provided
  const currentLanguage = language || searchState.language;
  const isPython = currentLanguage === 'python';

  // Map language to registry value
  const languageConfig = language_options.find(l => l.value === currentLanguage);
  const registryValue = languageConfig?.registry || 'pypi';

  console.log(`filter: ${JSON.stringify(filter)}, page: ${page}, append: ${append}, language: ${currentLanguage}`)

  // Start with registry filter
  let filterString = `registry:=${registryValue}`;
  let baseFilterString = filterString;

  // Python-specific filters (Plone versions and package types)
  if (isPython) {
    let classifiers = ["Framework :: Plone"];
    if (filter && filter.package_types.length > 0) {
      classifiers = filter.package_types;
    }
    if (term == "" && (filter && (filter.package_types == undefined && filter.plone_versions == undefined))) { return }
    if (filter && (filter.package_types != undefined || filter.plone_versions != undefined)) {
      term = term || "*"
    }

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
  } else {
    // For JavaScript, ensure we have a search term
    term = term || "*";
  }

  searchState.isLoading = true;

  let commonSearchParams = {
    'exclude_fields': 'description',
    'group_by': 'name_sortable',
    'group_limit': 1,
    'per_page': PER_PAGE,
    'page': page,
    'q': term,
    'collection': PUBLIC_SEARCH_COLLECTION
  }
  // Build sort_by based on sort selection and search term
  let sortBy: string;
  if (sort === '_text_match:desc') {
    // Pure relevance sort - no secondary sort to avoid overriding weighted field scores
    sortBy = '_text_match:desc';
  } else if (term && term !== '*') {
    // Search term active - prepend relevance to maintain match quality
    sortBy = `_text_match:desc,${sort},upload_timestamp:desc`;
  } else {
    // No search term - use selected sort with timestamp fallback
    sortBy = `${sort},upload_timestamp:desc`;
  }

  const query_by = "name,title,summary,keywords,first_chapter,main_content,changelog";
  const query_by_weights = "127,127,90,90,75,30,1";

  // Facet fields depend on language
  const facetBy = isPython ? 'framework_versions,python_versions' : '';

  let searchRequests = {
    'searches': [
      {
        'query_by': query_by,
        'query_by_weights': query_by_weights,
        'text_match_type': 'max_weight',
        'prioritize_exact_match': true,
        'prioritize_token_position': true,
        'prioritize_num_matching_fields': false,
        'sort_by': sortBy,
        'facet_by': facetBy,
        'filter_by': filterString
      }
    ]
  }
  if (isPython && filter && filter.plone_versions.length > 0) {
    let facetSearch = {
      'query_by': query_by,
      'query_by_weights': query_by_weights,
      'text_match_type': 'max_weight',
      'prioritize_exact_match': true,
      'prioritize_token_position': true,
      'prioritize_num_matching_fields': false,
      'facet_by': facetBy,
      'filter_by': baseFilterString
    }
    searchRequests.searches.push(facetSearch as any)
  }
  console.log("query:", searchRequests)
  searchClient.multiSearch.perform(searchRequests as any, commonSearchParams).then((searchResults: any) => {
    console.log(searchResults)
    if (searchResults === undefined) {
      searchState.isLoading = false;
      return;
    }

    const newHits = searchResults.results[0].grouped_hits || [];
    const foundTotal = searchResults.results[0].found;

    if (append) {
      searchState.packageList = [...searchState.packageList, ...newHits];
    } else {
      searchState.packageList = newHits;
    }

    searchState.totalFound = foundTotal;
    searchState.currentPage = page;

    // Calculate if there are more results to load
    const currentCount = append ? searchState.packageList.length : newHits.length;
    searchState.hasMore = currentCount < foundTotal;

    // Only process facets for Python
    if (isPython) {
      let facetResultsIndex: number = 0;
      if (searchResults.results.length === 2) {
        facetResultsIndex++;
      }

      searchResults.results[facetResultsIndex].facet_counts?.forEach((facet: any) => {
        if (facet.field_name === 'framework_versions') {
          let versions: VersionInfo[] = [];
          facet.counts.forEach((version: VersionInfo) => {
            versions.push(version)
          })
          searchState.ploneVersionsAvailable = versions.sort(function (a, b) {
            var nameA = a.value.toUpperCase();
            var nameB = b.value.toUpperCase();
            if (nameA > nameB) {
              return -1;
            }
            if (nameA < nameB) {
              return 1;
            }
            return 0;
          });
          console.log(versions)
        }
      });
    }

    searchState.isLoading = false;
  }).catch((error: any) => {
    console.error("Search error:", error);
    searchState.isLoading = false;
  });
}

// Helper function to load the next page
export function loadMore(term?: string, filter?: Filter, sort?: string, language?: Language) {
  const nextPage = searchState.currentPage + 1;
  const currentSort = sort || searchState.sort;
  const currentLanguage = language || searchState.language;
  doSearch(term, filter, nextPage, true, currentSort, currentLanguage);
}

// Helper function to reset pagination state
export function resetPagination() {
  searchState.currentPage = 1;
  searchState.hasMore = true;
  searchState.totalFound = 0;
  searchState.packageList = [];
}

// Fetch facets only (for initial page load to populate version filters)
export async function fetchInitialFacets(language?: Language) {
  // Only fetch facets for Python packages
  const currentLanguage = language || searchState.language;
  if (currentLanguage !== 'python') {
    return;
  }

  try {
    const result = await searchClient.collections(collectionName).documents().search({
      q: '*',
      facet_by: 'framework_versions',
      per_page: 0,
      filter_by: "registry:=pypi && classifiers:=['Framework :: Plone', 'Framework :: Plone :: Addon', 'Framework :: Plone :: Theme', 'Framework :: Plone :: Core', 'Framework :: Plone :: Distribution']"
    });

    if (result.facet_counts) {
      result.facet_counts.forEach((facet: any) => {
        if (facet.field_name === 'framework_versions') {
          const versions: VersionInfo[] = facet.counts.map((v: VersionInfo) => v);
          searchState.ploneVersionsAvailable = versions.sort((a, b) => {
            return b.value.toUpperCase().localeCompare(a.value.toUpperCase());
          });
        }
      });
    }
  } catch (error) {
    console.error("Failed to fetch initial facets:", error);
  }
}
