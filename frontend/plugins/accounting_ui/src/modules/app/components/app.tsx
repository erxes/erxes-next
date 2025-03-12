import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';

const PtrList = lazy(() =>
  import('~/pages/PtrListPage').then((module) => ({
    default: module.PtrListPage,
  })),
);

const PluginAccounting = () => {
  return (
    <Suspense fallback={<></>}>
      <BrowserRouter basename="/accounting">
        <Routes>
          <Route path="/" element={<PtrList />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default PluginAccounting;
