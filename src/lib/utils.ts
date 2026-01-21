
export function getPloneVersions(classifiers: string[]): string[] {
    const versions: string[] = [];
    classifiers.forEach((cf: string) => {
        const regex = /^Framework :: Plone :: (?<version>\d+.*)$/im;
        const found = cf.match(regex);
        if (found && found.groups) {
            versions.push(found.groups.version);
        }
    });
    return versions;
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
    return versions;
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