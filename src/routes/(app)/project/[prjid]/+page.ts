import { searchClient } from "$lib/search";

export async function load({ params }) {
    const searchResults = await searchClient.collections('packages').documents(params.prjid).retrieve()
    // console.log(searchResults)
    return searchResults;
}

