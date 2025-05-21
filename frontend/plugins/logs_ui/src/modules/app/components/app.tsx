import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const Logs = lazy(() =>
  import('~/pages').then((module) => ({
    default: module.Page,
  })),
);

const App = () => {
  return (
    <Suspense fallback={<>Loading</>}>
      <Routes>
        <Route path="/" element={<Logs />} />
      </Routes>
    </Suspense>
  );
};

export default App;
