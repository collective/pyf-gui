
export interface Filter {
    plone_versions: string[];
    package_type: string;
}

export interface VersionInfo {
  value: string;
  highlighted: string;
  count: number;
}
