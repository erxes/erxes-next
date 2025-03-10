import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';

const Sample = lazy(() =>
  import('~/pages/SampleIndexPage').then((module) => ({
    default: module.SampleIndexPage,
  })),
);

const PluginSample = () => {
  return (
    <Suspense fallback={<></>}>
      <BrowserRouter basename="/sample">
        <Routes>
          <Route path="/" element={<Sample />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default PluginSample;
