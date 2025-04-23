import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router';

import { ContactsPath } from '@/types/paths/ContactsPath';

const ContactsIndexPage = lazy(() =>
  import('~/pages/contacts/ContactsIndexPage').then((module) => ({
    default: module.ContactsIndexPage,
  })),
);

const CompaniesIndexPage = lazy(() =>
  import('~/pages/contacts/companies/CompaniesIndexPage').then((module) => ({
    default: module.CompaniesIndexPage,
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
        <Route path={ContactsPath.Companies} element={<CompaniesIndexPage />} />
      </Routes>
    </Suspense>
  );
};
