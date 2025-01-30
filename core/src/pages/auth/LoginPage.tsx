import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { currentUserState } from 'erxes-shared-states';
import { useRecoilValue } from 'recoil';

import { Logo } from '@/auth/components/Logo';
import { Login } from '@/auth/login/components/Login';
import { AppPath } from '@/types/paths/AppPath';

const LoginPage = () => {
  const navigate = useNavigate();
  const currentUser = useRecoilValue(currentUserState);
  useEffect(() => {
    if (currentUser) {
      navigate(AppPath.Index);
    }
  }, [currentUser, navigate]);

  return (
    <div className="flex items-center justify-center my-48">
      <div className="motion-preset-slide-down-md grid gap-5">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="flex flex-col items-center">
          <h2 className="font-semibold text-2xl">Welcome</h2>
          <p className="text-xs text-muted-foreground">
            Please sign in to your account to continue
          </p>
        </div>
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
