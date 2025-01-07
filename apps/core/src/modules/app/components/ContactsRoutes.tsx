import { ContactsPath } from '@/types/ContactsPath';
import { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';

const ContactsIndexPage = lazy(() =>
  import('~/pages/contacts/ContactsIndexPage').then((module) => ({
    default: module.ContactsIndexPage,
  }))
);

const ContactsRoutes = () => {
  return (
    <Suspense fallback={<></>}>
      <Routes>
        <Route path={ContactsPath.Index} element={<ContactsIndexPage />} />
      </Routes>
    </Suspense>
  );
};

export default ContactsRoutes;
