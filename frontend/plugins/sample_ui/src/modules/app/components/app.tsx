import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const Sample = lazy(() =>
  import('~/pages/SampleIndexPage').then((module) => ({
    default: module.SampleIndexPage,
  })),
);

const PluginSample = () => {
  return (
    <Suspense fallback={<></>}>
      <Routes>
        <Route path="/" element={<Sample />} />
      </Routes>
    </Suspense>
  );
};

export default PluginSample;
