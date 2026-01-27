import { searchClient, collectionName } from "$lib/search";
import { compareVersions } from "$lib/utils";
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
        'sort_by': 'upload_timestamp:desc'
    }

    const searchResults = await searchClient.collections(collectionName).documents().search(searchParameters)
    if(!searchResults) { return }
    const hits = searchResults.hits;
    if (!hits || hits.length === 0) { return }
    const sortedHits = [...hits].sort((a, b) =>
        compareVersions((a.document as Package).version, (b.document as Package).version)
    );
    const releases = _getReleases(sortedHits as Array<{ document: Package }>);
    return {hit: sortedHits[0].document as Package, releases: releases}
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