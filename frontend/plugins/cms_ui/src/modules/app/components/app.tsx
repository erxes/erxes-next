import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { Spinner } from 'erxes-ui';
import { CmsLayout } from '~/modules/layout/components/CmsLayout';

const CmsPage = lazy(() =>
  import('~/pages/CmsPage').then((module) => ({
    default: module.CmsPage,
  })),
);
const CmsPostPage = lazy(() =>
  import('~/pages/CmsPostsPage').then((module) => ({
    default: module.CmsPostPage,
  })),
);

const CmsCreatePostPage = lazy(() =>
  import('~/pages/CmsCreatePost').then((module) => ({
    default: module.CmsCreatePost,
  })),
);
const PluginCms = () => {
  return (
    <CmsLayout>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<CmsPage />} />
          <Route path="/:slug/posts" element={<CmsPostPage />} />
          <Route path="/:slug/tags" element={<CmsPostPage />} />
          <Route path="/:slug/categories" element={<CmsPostPage />} />
          <Route path="/:slug/pages" element={<CmsPostPage />} />
          <Route path="/:slug/custom-types" element={<CmsPostPage />} />
          <Route path="/:slug/create" element={<CmsCreatePostPage />} />
        </Routes>
      </Suspense>
    </CmsLayout>
  );
};
export default PluginCms;
