import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router';

import { ContactsPath } from '@/types/paths/ContactsPath';

const ContactsIndexPage = lazy(() =>
  import('~/pages/contacts/ContactsIndexPage').then((module) => ({
    default: module.ContactsIndexPage,
  })),
);

const ContactsDetailPage = lazy(() =>
  import('~/pages/contacts/ContactsDetailPage').then((module) => ({
    default: module.ContactsDetailPage,
  })),
);

export const ContactsRoutes = () => {
  return (
    <Suspense fallback={<></>}>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={`${ContactsPath.Customers}`} replace />}
        />
        <Route path={ContactsPath.Customers} element={<ContactsIndexPage />} />
        <Route path={ContactsPath.Leads} element={<ContactsDetailPage />} />
        <Route path={ContactsPath.Companies} element={<ContactsDetailPage />} />
        <Route path={ContactsPath.Vendors} element={<ContactsDetailPage />} />
        <Route path={ContactsPath.Clients} element={<ContactsDetailPage />} />
      </Routes>
    </Suspense>
  );
};
