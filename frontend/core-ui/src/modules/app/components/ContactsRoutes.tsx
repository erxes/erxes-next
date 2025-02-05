import { lazy, Suspense } from 'react';
import { Route } from 'react-router';
import { Routes } from 'react-router';

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
        <Route path={ContactsPath.Index} element={<ContactsIndexPage />} />
        <Route path={ContactsPath.Detail} element={<ContactsDetailPage />} />
      </Routes>
    </Suspense>
  );
};
