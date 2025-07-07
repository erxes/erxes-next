import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const IndexPage = lazy(() =>
  import('~/pages/saving/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);

const ContactTypePage = lazy(() =>
  import('~/pages/saving/ContactTypePage').then((module) => ({
    default: module.ContactTypePage,
  })),
);

const savingMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/contactTypes" element={<ContactTypePage />} />
      </Routes>
    </Suspense>
  );
};

export default savingMain;
