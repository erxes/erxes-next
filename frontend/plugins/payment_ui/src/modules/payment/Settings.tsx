import { Route, Routes } from 'react-router-dom';
import { lazy } from 'react';

export const PaymentsSettingsPage = lazy(() =>
  import('~/pages/payment/PaymentsGridPage').then((module) => ({
    default: module.default,
  })),
);

export const PaymentListPage = lazy(() =>
  import('~/pages/payment/PaymentListPage').then((module) => ({
    default: module.default,
  })),
);

const paymentSettings = () => {
  return (  
    <Routes>
      <Route path="/" element={<PaymentsSettingsPage />} />
      <Route path="/:kind" element={<PaymentListPage />} />
    </Routes>
  );
};

export default paymentSettings;
