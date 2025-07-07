import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
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

const AdjustmentsHomePage = lazy(() =>
  import('~/pages/AdjustmentsPage').then((module) => ({
    default: module.AdjustmentsHomePage,
  })),
);

const AdjustInventoryList = lazy(() =>
  import('~/pages/AdjustInventoryListPage').then((module) => ({
    default: module.AdjustInventoryListPage,
  })),
);

const AdjustInventoryForm = lazy(() =>
  import('~/pages/AdjustInventoryFormPage').then((module) => ({
    default: module.AdjustInventoryFormPage,
  })),
);

const PluginAccounting = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-full">
          <Spinner size="small" />
        </div>
      }
    >
      <Routes>
        <Route
          path="/"
          element={<TransactionList />}
        />
        <Route path="/main" element={<TransactionList />} />
        <Route path="/records" element={<TrRecordList />} />
        <Route path="/transaction/edit" element={<TransactionForm />} />
        <Route path="/transaction/create" element={<TransactionForm />} />
        <Route path="/adjustment" element={<AdjustmentsHomePage />} />
        <Route path="/adjustment/inventory" element={<AdjustInventoryList />} />
        <Route path="/adjustment/inventory/create" element={<AdjustInventoryForm />} />
        <Route path="/adjustment/inventory/edit" element={<AdjustInventoryForm />} />
      </Routes>
      <PageChangeEffect />
    </Suspense>
  );
};

export default PluginAccounting;
