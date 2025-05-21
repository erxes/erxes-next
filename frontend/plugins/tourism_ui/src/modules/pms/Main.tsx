import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const SampleFirst = lazy(() =>
  import('~/pages/pms/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);

const SampleFirstMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<SampleFirst />} />
      </Routes>
    </Suspense>
  );
};

export default SampleFirstMain;
