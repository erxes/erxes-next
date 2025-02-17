import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import '~/styles.css';

const Inbox = lazy(() =>
  import('~/pages/InboxIndexPage').then((module) => ({
    default: module.InboxIndexPage,
  })),
);

const PluginInbox = () => {
  return (
    <Suspense fallback={<>Loading...</>}>
      <BrowserRouter basename="/inbox">
        <Routes>
          <Route path="/" element={<Inbox />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default PluginInbox;
