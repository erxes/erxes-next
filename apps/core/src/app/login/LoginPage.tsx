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

  return <Login />;
};

export default LoginPage;
