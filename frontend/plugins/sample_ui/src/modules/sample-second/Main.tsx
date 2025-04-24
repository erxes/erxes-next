import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const Sample = lazy(() =>
  import('~/pages/sample-second/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);

const SampleSecondMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<Sample />} />
      </Routes>
    </Suspense>
  );
};

export default SampleSecondMain;
