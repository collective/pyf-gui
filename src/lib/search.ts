import { package_list } from "./stores";
import { results_count } from "./stores";
import { SearchClient } from "typesense";
import { PUBLIC_SEARCH_PROTOCOL } from '$env/static/public';
import { PUBLIC_SEARCH_HOST } from '$env/static/public';
import { PUBLIC_SEARCH_PORT } from '$env/static/public';
import { PUBLIC_SEARCH_API_KEY } from '$env/static/public';

// let term:string = "*";
// let filter = {} as any;

// export const unsub_search_term = search_term.subscribe(value => {
//   term = value;
// });

// export const unsub_search_filter = search_filter.subscribe(value => {
//   filter = value;
// });


export let searchClient = new SearchClient({
  'nodes': [{
    'host': PUBLIC_SEARCH_HOST, // For Typesense Cloud use xxx.a1.typesense.net
    'port': PUBLIC_SEARCH_PORT,      // For Typesense Cloud use 443
    'protocol': PUBLIC_SEARCH_PROTOCOL // For Typesense Cloud use https
  }],
  'apiKey': PUBLIC_SEARCH_API_KEY,
  'connectionTimeoutSeconds': 2
})


export function doSearch(term?:string, filter?:{}, ) {
  let classifiers = ["Framework :: Plone"];
  if (filter.plone_version) {
    classifiers.push(filter.plone_version);
  }
  if (filter.package_type) {
    classifiers.push(filter.package_type);
  }
  if (term == "" &&  filter.package_type == undefined && filter.plone_version == undefined) { return }
  if(filter.package_type != undefined || filter.plone_version != undefined){
    term = term || "*"
  }
  let filterString = "";
  classifiers.forEach((classifier, key, arr) => {
    filterString += `classifiers:=${classifier}`
    if (!Object.is(arr.length - 1, key)) {
      filterString += ' && '
    }
  });
  let searchParameters = {
    'q': term,
    'query_by': 'name,keywords,summary,description',
    'sort_by': '_text_match:desc,name_sortable:asc,version_raw:desc',
    'group_by': 'name_sortable',
    'group_limit': 1,
    'per_page': 100,
    'filter_by': filterString
  }
  console.log("query:", searchParameters)
  searchClient.collections('packages').documents().search(searchParameters).then((searchResults as any) =>{
    console.log(searchResults)
    package_list.set(searchResults.grouped_hits)
    results_count.set(searchResults.found)
    // return searchResults.grouped_hits
  })
}
