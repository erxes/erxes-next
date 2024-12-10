import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { currentUserState } from 'erxes-shared-states';

const Inbox = lazy(() =>
  import('./inbox').then((module) => ({ default: module.Inbox }))
);
const Starred = lazy(() => import('./starred'));

const PluginInbox = () => {
  const currentUser = useRecoilValue(currentUserState);
  console.log(currentUser);

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
