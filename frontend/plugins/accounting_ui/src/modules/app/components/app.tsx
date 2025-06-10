import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Spinner } from 'erxes-ui';
import { PageChangeEffect } from '../effect-components/AccountingPageChangeEffect';

const TransactionList = lazy(() =>
  import('~/pages/TransactionListPage').then((module) => ({
    default: module.TransactionListPage,
  })),
);

const TrRecordList = lazy(() =>
  import('~/pages/TrRecordListPage').then((module) => ({
    default: module.TrRecordListPage,
  })),
);

const TransactionForm = lazy(() =>
  import('~/pages/TransactionFormPage').then((module) => ({
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
        <Route
          path="/"
          element={<Navigate to={`/accounting/main`} replace />}
        />
        <Route path="/main" element={<TransactionList />} />
        <Route path="/records" element={<TrRecordList />} />
        <Route path="/transaction/edit" element={<TransactionForm />} />
        <Route path="/transaction/create" element={<TransactionForm />} />
      </Routes>
      <PageChangeEffect />
    </Suspense>
  );
};

export default PluginAccounting;
