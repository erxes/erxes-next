import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const Inbox = lazy(() =>
  import('./inbox').then((module) => ({ default: module.Inbox }))
);
const Starred = lazy(() => import('./starred'));

const PluginInbox = () => {
  return (
    <Suspense fallback={<>Loading...</>}>
      <Routes>
        <Route path="/" element={<Inbox />} />
        <Route path="/starred" element={<Starred />} />
      </Routes>
    </Suspense>
  );
};

export default PluginInbox;
