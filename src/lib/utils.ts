
export function getPloneVersions(classifiers: []) {
    const versions: [] = [];
    classifiers.forEach((cf: string) => {
        const regex = /^Framework :: Plone :: (?<version>\d+.*)$/im;
        const found = cf.match(regex);
        if (found && found.groups) {
            versions.push(found.groups.version);
        }
    });
    return versions;
}

export function compactPloneVersions(ploneVersions: []) {
    const versions: [] = [];
    ploneVersions.forEach((cf: string) => {
        const regex = /^Plone\s+(?<version>\d+.*)$/im;
        const found = cf.match(regex);
        if (found && found.groups) {
            versions.push(found.groups.version);
        }
    });
    return `${versions.join(', ')}`;
}

export function getPythonVersions(classifiers: []) {
    let versions: [] = [];
    classifiers.forEach((cf: string) => {
        const regex = /^Programming Language :: Python :: (?<version>\d+.*)$/im;
        const found = cf.match(regex);
        if (found && found.groups) {
            versions.push(found.groups.version);
        }
    });
    return versions;
}

export function compactPythonVersions(ploneVersions: []) {
    const versions: [] = [];
    ploneVersions.forEach((cf: string) => {
        const regex = /^Python\s+(?<version>\d+.*)$/im;
        const found = cf.match(regex);
        if (found && found.groups) {
            versions.push(found.groups.version);
        }
    });
    return `${versions.join(', ')}`;
}

export function getPackageType(classifiers: []) {
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
    return packageType;
}

export function toLocalizedTime(uts: number) {
    if (!uts) {
        return "";
    }
    const date = new Date(uts * 1000);
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString(undefined, options);
}