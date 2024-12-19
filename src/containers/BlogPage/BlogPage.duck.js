import { fetchPageAssets } from '../../ducks/hostedAssets.duck';

export const loadData = (params, search) => dispatch => {
  const pageId = params.pageId;
  const pageAsset = !!pageId ? { [pageId]: `content/pages/blog-${pageId}.json` } : { [pageId]: `content/pages/blog.json` };
  const hasFallbackContent = false;
  return dispatch(fetchPageAssets(pageAsset, hasFallbackContent));
};
