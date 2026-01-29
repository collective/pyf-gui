/**
 * Compare two version strings for sorting (descending - newer first)
 */
export function compareVersions(a: string, b: string): number {
    const partsA = a.split('.').map(n => parseInt(n, 10) || 0);
    const partsB = b.split('.').map(n => parseInt(n, 10) || 0);
    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        const numA = partsA[i] || 0;
        const numB = partsB[i] || 0;
        if (numA !== numB) return numB - numA;
    }
    return 0;
}

export function getPloneVersions(classifiers: string[]): string[] {
    const versions: string[] = [];
    classifiers.forEach((cf: string) => {
        const regex = /^Framework :: Plone :: (?<version>\d+.*)$/im;
        const found = cf.match(regex);
        if (found && found.groups) {
            versions.push(found.groups.version);
        }
    });
    return versions.sort(compareVersions);
}

export function compactPloneVersions(ploneVersions: string[]): string {
    const versions: string[] = [];
    ploneVersions.forEach((cf: string) => {
        const regex = /^Plone\s+(?<version>\d+.*)$/im;
        const found = cf.match(regex);
        if (found && found.groups) {
            versions.push(found.groups.version);
        }
    });
    return `${versions.join(', ')}`;
}

export function getPythonVersions(classifiers: string[]): string[] {
    const versions: string[] = [];
    classifiers.forEach((cf: string) => {
        const regex = /^Programming Language :: Python :: (?<version>\d+.*)$/im;
        const found = cf.match(regex);
        if (found && found.groups) {
            versions.push(found.groups.version);
        }
    });
    return versions.sort(compareVersions);
}

export function compactPythonVersions(ploneVersions: string[]): string {
    const versions: string[] = [];
    ploneVersions.forEach((cf: string) => {
        const regex = /^Python\s+(?<version>\d+.*)$/im;
        const found = cf.match(regex);
        if (found && found.groups) {
            versions.push(found.groups.version);
        }
    });
    return `${versions.join(', ')}`;
}

export function getPackageType(classifiers: string[] | undefined): string {
    let packageType = "";
    if (classifiers === undefined){ return packageType}
    if (classifiers.indexOf("Framework :: Plone :: Addon") != -1) {
        packageType = "Addon";
    }
    if (classifiers.indexOf("Framework :: Plone :: Core") != -1) {
        packageType = "Core";
    }
    if (classifiers.indexOf("Framework :: Plone :: Theme") != -1) {
        packageType = "Theme";
    }
    if (classifiers.indexOf("Framework :: Plone :: Distribution") != -1) {
        packageType = "Distribution";
    }
    return packageType;
}

export function toLocalizedTime(uts: number): string {
    if (!uts) {
        return "";
    }
    const date = new Date(uts * 1000);
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString(undefined, options);
}

export function formatNumber(num: number | undefined | null): string {
    if (num === undefined || num === null) return "0";
    if (num < 1000) return num.toString();
    if (num < 1000000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
}

/**
 * Project URL label aliases - maps variations to canonical types
 * Based on PEP 753 and common PyPI conventions
 */
export const PROJECT_URL_ALIASES: Record<string, string> = {
    // Homepage
    'home': 'homepage',
    'website': 'homepage',
    'home page': 'homepage',
    'home-page': 'homepage',
    // Source
    'repository': 'source',
    'github': 'source',
    'gitlab': 'source',
    'bitbucket': 'source',
    'code': 'source',
    'source code': 'source',
    // Documentation
    'docs': 'documentation',
    'doc': 'documentation',
    'documents': 'documentation',
    // Issues
    'bugs': 'issues',
    'tracker': 'issues',
    'bug tracker': 'issues',
    'issue tracker': 'issues',
    'bug-tracker': 'issues',
    'issue-tracker': 'issues',
    // Changelog
    'changes': 'changelog',
    'history': 'changelog',
    'release notes': 'changelog',
    'release-notes': 'changelog',
    'whatsnew': 'changelog',
    'what\'s new': 'changelog',
    // Funding
    'sponsor': 'funding',
    'donate': 'funding',
    'donation': 'funding',
    'donations': 'funding',
    'sponsors': 'funding',
    // Download
    'downloads': 'download',
};

/**
 * Bootstrap Icons SVG strings for project URL types
 */
export const PROJECT_URL_ICONS: Record<string, string> = {
    homepage: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door" viewBox="0 0 16 16"><path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z"/></svg>',
    source: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-code-slash" viewBox="0 0 16 16"><path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0"/></svg>',
    documentation: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-book" viewBox="0 0 16 16"><path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/></svg>',
    issues: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bug" viewBox="0 0 16 16"><path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3a5 5 0 0 1 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z"/></svg>',
    changelog: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-journal-text" viewBox="0 0 16 16"><path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/><path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/><path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/></svg>',
    funding: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16"><path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/></svg>',
    download: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/></svg>',
    pypi: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-seam" viewBox="0 0 16 16"><path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2zm3.564 1.426L5.596 5 8 5.961 14.154 3.5zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/></svg>',
    fallback: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16"><path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/><path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/></svg>',
};

/**
 * Priority order for sorting project URLs
 * Lower numbers appear first
 */
const PROJECT_URL_PRIORITY: Record<string, number> = {
    homepage: 1,
    source: 2,
    documentation: 3,
    issues: 4,
    changelog: 5,
    funding: 6,
    download: 7,
    pypi: 8,
};

export interface ProcessedProjectUrl {
    label: string;
    url: string;
    icon: string;
    type: string;
}

/**
 * Process project URLs from PyPI metadata
 * Maps labels to canonical types and adds appropriate icons
 */
export function processProjectUrls(projectUrls: Record<string, string>): ProcessedProjectUrl[] {
    const processed: ProcessedProjectUrl[] = [];

    for (const [label, url] of Object.entries(projectUrls)) {
        const normalizedLabel = label.toLowerCase().trim();
        const type = PROJECT_URL_ALIASES[normalizedLabel] || normalizedLabel;
        const icon = PROJECT_URL_ICONS[type] || PROJECT_URL_ICONS.fallback;

        processed.push({
            label,
            url,
            icon,
            type,
        });
    }

    // Sort by priority (known types first, then alphabetically)
    processed.sort((a, b) => {
        const priorityA = PROJECT_URL_PRIORITY[a.type] ?? 100;
        const priorityB = PROJECT_URL_PRIORITY[b.type] ?? 100;
        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }
        return a.label.localeCompare(b.label);
    });

    return processed;
}