import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const List = lazy(() =>
  import('~/pages').then((module) => ({
    default: module.Page,
  })),
);
const Detail = lazy(() =>
  import('~/pages/Detail').then((module) => ({
    default: module.Page,
  })),
);

const App = () => {
  return (
    <Suspense fallback={<>Loading</>}>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/edit/:id" element={<Detail />} />

        <Route path="/create" element={<Detail />} />
      </Routes>
    </Suspense>
  );
};

export default App;
