import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const List = lazy(() =>
  import('~/pages').then((module) => ({
    default: module.Page,
  })),
);
const Editor = lazy(() =>
  import('~/pages/Detail').then((module) => ({
    default: module.Page,
  })),
);

const App = () => {
  return (
    <Suspense fallback={<>Loading</>}>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/edit/:id" element={<Editor />} />

        <Route path="/create" element={<Editor />} />
      </Routes>
    </Suspense>
  );
};

export default App;
