import { useApolloClient, useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { Logout } from '@/auth/graphql/mutations/logout';

import { isCurrentUserLoadedState } from '@/auth/states/isCurrentUserLoadingState';
import { currentUserState } from '@/auth/states/currentUserState';

import { useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [logout] = useMutation(Logout);
  const setCurrentUser = useSetRecoilState(currentUserState);
  const setIsCurrentUserLoaded = useSetRecoilState(isCurrentUserLoadedState);

  const navigate = useNavigate();

  const client = useApolloClient();

  const handleLogout = useCallback(async () => {
    await logout();
    client.resetStore();

    setIsCurrentUserLoaded(false);
    setCurrentUser(undefined);

    sessionStorage.clear();
    localStorage.clear();

    navigate('/login');
  }, [logout, navigate, setCurrentUser, setIsCurrentUserLoaded, client]);

  return {
    handleLogout,
  };
};
