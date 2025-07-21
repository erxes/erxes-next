import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const Knowledgebase = lazy(() =>
  import('~/pages/knowledgebase/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);
const ClientPortal = lazy(() =>
  import('~/pages/clientportal/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);

const ContentFirstMain = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<ClientPortal />} />
      </Routes>
    </Suspense>
  );
};

export default ContentFirstMain;
