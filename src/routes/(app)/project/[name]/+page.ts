import { searchClient, collectionName } from "$lib/search";
import type { Package } from '$lib/interfaces';

interface Release {
    version: string;
    python_versions: string[];
    framework_versions: string[];
}

export async function load({ params }): Promise<{ hit: Package; releases: Release[] } | undefined> {

    let searchParameters = {
        'q': params.name,
        'query_by': 'name',
        'sort_by': 'version_sortable:desc'
    }

    const searchResults = await searchClient.collections(collectionName).documents().search(searchParameters)
    if(!searchResults) { return }
    // const searchResults = await searchClient.collections('packages').documents(params.name).retrieve()
    const hits = searchResults.hits;
    if (!hits || hits.length === 0) { return }
    const releases = _getReleases(hits as Array<{ document: Package }>);
    console.dir(`releases: ${releases}`)
    return {hit: hits[0].document as Package, releases: releases}
}

function _getReleases(hits: Array<{ document: Package }>): Release[] {
    const releases: Release[] = [];
    hits.forEach(release => {
        releases.push({
            version: release.document.version,
            python_versions: release.document.python_versions || [],
            framework_versions: release.document.framework_versions || []
        })
    });
    return releases;
}