
export interface Filter {
    plone_versions: string[];
    package_types: string[];
}

export interface Contributor {
  avatar_url: string;
  contributions: number;
  username: string;
}

export interface GroupedHit {
    group_key: string[];
    hits: Array<{ document: Package }>;
}

export interface VersionInfo {
  value: string;
  highlighted: string;
  count: number;
}

export interface Package {
  name: string;
  version: string;
  summary?: string;
  description?: string;
  keywords?: string;
  classifiers?: string[];
  upload_timestamp?: string | number;
  project_url?: string;
  python_versions?: string[];
  framework_versions?: string[];

  // GitHub stats
  github_url?: string;
  github_stars?: number;
  github_watchers?: number;
  github_open_issues?: number;
  github_updated?: number;

  // PyPI download stats
  download_total?: number;
  download_last_month?: number;
  download_last_week?: number;
  download_last_day?: number;
  download_updated?: number;

  // Health score
  health_score?: number;
  health_score_breakdown?: {
    documentation?: number;
    metadata?: number;
    recency?: number;
  };

  // Project URLs from PyPI metadata
  project_urls?: Record<string, string>;

  // Contributors
  contributors?: Contributor[];
}
