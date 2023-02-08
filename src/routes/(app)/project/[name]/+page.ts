import { searchClient } from "$lib/search";
import { python_versions } from '../../../../lib/stores';

export async function load({ params }) {

    let searchParameters = {
        'q': params.name,
        'query_by': 'name',
        'sort_by': 'version_sortable:desc'
    }

    const searchResults = await searchClient.collections('packages').documents().search(searchParameters)
    if(!searchResults) { return }
    // const searchResults = await searchClient.collections('packages').documents(params.name).retrieve()
    const hits = await searchResults.hits;
    const releases = await _getReleases(hits);
    console.dir(`releases: ${releases}`)
    return {hit: hits[0].document, releases: releases}
}

async function _getReleases(hits){
    let releases = [];
    hits.forEach(release => {
        releases.push({
            version: release.document.version,
            python_versions: release.document.python_versions,
            framework_versions: release.document.framework_versions
        })
    });
    return releases;
}