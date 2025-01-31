import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { currentUserState } from 'erxes-shared-states';
import { useRecoilValue } from 'recoil';

import { DynamicBanner } from '@/auth/banner/DynamicBanner';
import { Login } from '@/auth/login/components/Login';
import { AppPath } from '@/types/AppPath';

const LoginPage = () => {
  const navigate = useNavigate();
  const currentUser = useRecoilValue(currentUserState);
  useEffect(() => {
    if (currentUser) {
      navigate(AppPath.Index);
    }
  }, [currentUser, navigate]);

  return (
    <div className="grid grid-cols-2 h-screen">
      <DynamicBanner/>
      <Login/>
    </div>
  );
};

export default LoginPage;
