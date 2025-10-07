import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { OperationPaths } from '~/types/operationPaths';

export const TeamSettings = lazy(() =>
  import('@/team/TeamSettings').then((module) => ({
    default: module.TeamSettings,
  })),
);

const OperationSettings = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path={OperationPaths.TeamList} element={<TeamSettings />} />
      </Routes>
    </Suspense>
  );
};

export default OperationSettings;
