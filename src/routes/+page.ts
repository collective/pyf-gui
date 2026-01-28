import type { PageLoad } from './$types';
import { parseUrlParams, hasSearchParams } from '$lib/urlParams';

export const load: PageLoad = ({ url }) => {
  const urlHasParams = hasSearchParams(url.searchParams);
  const urlParams = parseUrlParams(url.searchParams);

  return {
    urlParams,
    urlHasParams
  };
};
