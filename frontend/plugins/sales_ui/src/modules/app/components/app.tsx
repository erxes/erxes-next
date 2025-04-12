import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const Sales = lazy(() =>
  import('~/pages/SalesIndexPage').then((module) => ({
    default: module.SalesIndexPage,
  })),
);

const PluginSales = () => {
  return (
    <Suspense fallback={<></>}>
      <Routes>
        <Route path="/" element={<Sales />} />
      </Routes>
    </Suspense>
  );
};

export default PluginSales;
