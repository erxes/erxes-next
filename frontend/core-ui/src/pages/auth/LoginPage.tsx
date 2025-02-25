import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { currentUserState } from 'ui-modules';
import { DynamicBanner } from '@/auth/dynamic-banner/components/DynamicBanner';
import { Login } from '@/auth/login/components/Login';
import { AppPath } from '@/types/paths/AppPath';
import { useAtom } from 'jotai';

const LoginPage = () => {
  const navigate = useNavigate();
  const [currentUser] = useAtom(currentUserState);
  useEffect(() => {
    if (currentUser) {
      navigate(AppPath.Index);
    }
  }, [currentUser, navigate]);

  return (
    <div className="grid lg:grid-cols-2 h-screen">
      <DynamicBanner className="hidden lg:block" />
      <Login />
    </div>
  );
};

export default LoginPage;
