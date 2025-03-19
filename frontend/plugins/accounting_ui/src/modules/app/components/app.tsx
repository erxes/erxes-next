import { lazy, Suspense } from 'react';
import {
  BrowserRouter,
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router';
import { Spinner } from 'erxes-ui';
const PtrList = lazy(() =>
  import('~/pages/PtrListPage').then((module) => ({
    default: module.PtrListPage,
  })),
);

const TransactionPage = lazy(() =>
  import('~/pages/TransactionPage').then((module) => ({
    default: module.TransactionPage,
  })),
);

const PluginAccounting = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      }
    >
      {/* <MemoryRouter basename="/accounting"> */}
      <Routes>
        <Route path="/" element={<PtrList />} />
        <Route path="/transaction" element={<TransactionPage />} />
      </Routes>
      {/* </MemoryRouter> */}
    </Suspense>
  );
};

export default PluginAccounting;
