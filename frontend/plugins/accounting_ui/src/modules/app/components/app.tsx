import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { Spinner } from 'erxes-ui';

const PtrList = lazy(() =>
  import('~/pages/PtrListPage').then((module) => ({
    default: module.PtrListPage,
  })),
);

const TransactionPage = lazy(() =>
  import('~/pages/TransactionPage').then((module) => ({
    default: module.TransactionPage,
  })),
);

const PluginAccounting = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<PtrList />} />
        <Route path="/transaction" element={<TransactionPage />} />
      </Routes>
    </Suspense>
  );
};

export default PluginAccounting;
