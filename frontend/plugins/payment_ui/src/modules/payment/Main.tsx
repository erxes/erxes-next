import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

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
       
      </Routes>
    </Suspense>
  );
};

export default paymentMain;
