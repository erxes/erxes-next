import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';

const Inbox = lazy(() =>
  import('./inbox').then((module) => ({ default: module.Inbox })),
);

const PluginInbox = () => {
  return (
    <Suspense fallback={<>Loading...</>}>
      <BrowserRouter basename="/inbox-ui">
        <Routes>
          <Route path="/" element={<Inbox />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default PluginInbox;
