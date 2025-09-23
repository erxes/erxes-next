import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const CmsIndex = lazy(() =>
  import('~/pages/cms/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);

const Posts = lazy(() =>
  import('~/modules/cms/components/Posts').then((module) => ({
    default: module.Posts,
  })),
);

const CmsMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<CmsIndex />} />
        <Route path="/:websiteId/posts" element={<Posts />} />
      </Routes>
    </Suspense>
  );
};

export default CmsMain;
