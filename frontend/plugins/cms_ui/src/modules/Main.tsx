import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Spinner } from 'erxes-ui';
import { CmsLayout } from '~/modules/layout/components/CmsLayout';
import { CmsProvider } from '~/modules/app/context/CmsContext';
import { PostPreviewProvider } from './app/context/PostPreviewContext';

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
const CmsCategoryPage = lazy(() =>
  import('~/pages/CmsCategoryPage').then((module) => ({
    default: module.CmsCategoryPage,
  })),
);
const CmsCustomTypePage = lazy(() =>
  import('~/pages/CmsCustomTypePage').then((module) => ({
    default: module.CmsCustomTypePage,
  })),
);
const CmsCustomFieldPage = lazy(() =>
  import('~/pages/CmsCustomFieldPage').then((module) => ({
    default: module.CmsCustomFieldPage,
  })),
);

const PluginCms = () => {
  return (
    <PostPreviewProvider>
      <CmsProvider>
        <CmsLayout>
          <Suspense
            fallback={
              <div className="flex justify-center items-center">
                <Spinner />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<CmsPage />} />
              <Route path="/:slug/posts" element={<CmsPostPage />} />
              <Route path="/:slug/tags" element={<CmsTagPage />} />
              <Route path="/:slug/categories" element={<CmsCategoryPage />} />
              <Route path="/:slug/pages" element={<CmsPostPage />} />
              <Route
                path="/:slug/custom-fields"
                element={<CmsCustomFieldPage />}
              />
              <Route
                path="/:slug/custom-types"
                element={<CmsCustomTypePage />}
              />
              <Route
                path="/:slug/create-post"
                element={<CmsCreatePostPage />}
              />
            </Routes>
          </Suspense>
        </CmsLayout>
      </CmsProvider>
    </PostPreviewProvider>
  );
};

export default PluginCms;
