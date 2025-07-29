import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import PaymentsPage from '~/pages/payment/PaymentsGridPage';

const IndexPage = lazy(() =>
  import('~/pages/payment/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);

const paymentMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/methods" element={<IndexPage />} />
        <Route path="/invoices" element={<IndexPage />} />
        <Route path="/settings/payment/:kind" element={<PaymentsPage />} />
      </Routes>
    </Suspense>
  );
};

export default paymentMain;
