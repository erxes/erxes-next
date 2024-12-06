import { useApolloClient, useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { Logout } from '@/auth/graphql/mutations/logout';

import { isCurrentUserLoadedState } from 'erxes-ui/states/isCurrentUserLoadingState';
import { currentUserState } from 'erxes-ui/states/currentUserState';
import { currentOrganizationState } from 'erxes-ui/states/currentOrganizationState';
import { isCurrentOrganizationLoadedState } from 'erxes-ui/states/currentOrganizationLoadingState';

import { useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [logout] = useMutation(Logout);
  const setCurrentUser = useSetRecoilState(currentUserState);
  const setIsCurrentUserLoaded = useSetRecoilState(isCurrentUserLoadedState);

  const setCurrentOrganization = useSetRecoilState(currentOrganizationState);
  const setIsCurrentOrganizationLoaded = useSetRecoilState(
    isCurrentOrganizationLoadedState
  );

  const navigate = useNavigate();

  const client = useApolloClient();

  const handleLogout = useCallback(async () => {
    await logout();
    client.resetStore();

    setIsCurrentUserLoaded(false);
    setCurrentUser(null);
    setCurrentOrganization(null);
    setIsCurrentOrganizationLoaded(false);

    sessionStorage.clear();
    localStorage.clear();

    navigate('/login');
  }, [
    logout,
    navigate,
    setCurrentUser,
    setIsCurrentUserLoaded,
    setCurrentOrganization,
    setIsCurrentOrganizationLoaded,
    client,
  ]);

  return {
    handleLogout,
  };
};
