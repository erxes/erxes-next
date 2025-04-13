import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Spinner } from 'erxes-ui';
import { CmsLayout } from '~/modules/layout/components/CmsLayout';
import { CmsProvider } from '~/modules/app/context/CmsContext'; // ⬅️ Import context provider

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
const CmsTagPage = lazy(() =>
  import('~/pages/CmsTagPage').then((module) => ({
    default: module.CmsTagPage,
  })),
);

const PluginCms = () => {
  return (
    <CmsProvider>
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
            <Route path="/:slug/tags" element={<CmsTagPage />} />
            <Route path="/:slug/categories" element={<CmsPostPage />} />
            <Route path="/:slug/pages" element={<CmsPostPage />} />
            <Route path="/:slug/custom-types" element={<CmsPostPage />} />
            <Route path="/:slug/create-post" element={<CmsCreatePostPage />} />
          </Routes>
        </Suspense>
      </CmsLayout>
    </CmsProvider>
  );
};

export default PluginCms;
