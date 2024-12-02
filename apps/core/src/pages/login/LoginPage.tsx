import Login from '@/auth/login/components/Login';
import { currentUserState } from '@/auth/states/currentUserState';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

const LoginPage = () => {
  const navigate = useNavigate();
  const currentUser = useRecoilValue(currentUserState);
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  return (
    <div className="flex items-center justify-center my-52">
      <div className="animate">
        <div className="mb-3 flex flex-col items-center">
          <h2 className="font-semibold text-2xl">Welcome!</h2>
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
