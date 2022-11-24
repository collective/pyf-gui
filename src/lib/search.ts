import { package_list } from "./stores";
import { results_count } from "./stores";
import { plone_versions } from "./stores";
import { python_versions } from "./stores";
import { Client } from "typesense";
import { PUBLIC_SEARCH_PROTOCOL } from '$env/static/public';
import { PUBLIC_SEARCH_HOST } from '$env/static/public';
import { PUBLIC_SEARCH_PORT } from '$env/static/public';
import { PUBLIC_SEARCH_API_KEY } from '$env/static/public';
import type { VersionInfo } from '$lib/interfaces';


export let searchClient = new Client({
  'nodes': [{
    'host': PUBLIC_SEARCH_HOST, // For Typesense Cloud use xxx.a1.typesense.net
    'port': PUBLIC_SEARCH_PORT,      // For Typesense Cloud use 443
    'protocol': PUBLIC_SEARCH_PROTOCOL // For Typesense Cloud use https
  }],
  'apiKey': PUBLIC_SEARCH_API_KEY,
  'connectionTimeoutSeconds': 2
})


export function doSearch(term?: string, filter?: { package_type: '', plone_versions: [] },) {
  let classifiers = ["Framework :: Plone"];
  if (filter && filter.package_type) {
    classifiers.push(filter.package_type);
  }
  if (term == "" && (filter && (filter.package_type == undefined && filter.plone_versions == undefined))) { return }
  if (filter && (filter.package_type != undefined || filter.plone_versions != undefined)) {
    term = term || "*"
  }
  let pVersions = [];
  if (filter && filter.plone_versions) {
    pVersions.push(filter.plone_versions);
  }
  let filterString = "";
  classifiers.forEach((classifier, key, arr) => {
    filterString += `classifiers:=${classifier}`
    if (!Object.is(arr.length - 1, key)) {
      filterString += ' && '
    }
  });
  let baseFilterString = filterString;
  // build plone_versions filter string:
  if (filter && filter.plone_versions.length > 0) {
    if (filterString) {
      filterString += ' && ';
    }
    let filterListString = ""
    filter.plone_versions.forEach((version, key, arr) => {
      filterListString += `'${version}'`;
      if (!Object.is(arr.length - 1, key)) {
        filterListString += ',';
      }
    });
    filterString += `framework_versions:=[${filterListString}]`;
  }

  let commonSearchParams = {
    'exclude_fields': 'description',
    'group_by': 'identifier',
    'group_limit': 1,
    'per_page': 100,
    'q': term,
    'collection': 'packages'
  }
  let searchRequests = {
    'searches': [
      {
        'query_by': 'name,keywords,summary,description',
        'sort_by': '_text_match:desc,name_sortable:asc,version_sortable:desc',
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
  searchClient.multiSearch.perform(searchRequests as any, commonSearchParams).then((searchResults: { results: any[] }) => {
    console.log(searchResults)
    if (searchResults === undefined) { return }
    package_list.set(searchResults.results[0].grouped_hits)
    results_count.set(searchResults.results[0].found)
    let facetResultsIndex: number = 0;
    if (searchResults.results.length === 2) {
      facetResultsIndex++;
    }

    searchResults.results[facetResultsIndex].facet_counts.forEach((facet) => {
      if (facet.field_name === 'framework_versions') {
        let versions: VersionInfo[] = [];
        facet.counts.forEach((version: VersionInfo) => {
          versions.push(version)
        })
        plone_versions.set(versions.sort(function (a, b) {
          var nameA = a.value.toUpperCase(); // ignore upper and lowercase
          var nameB = b.value.toUpperCase(); // ignore upper and lowercase
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
  })
}
