import { useApolloClient, useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { Logout } from '@/auth/graphql/mutations/logout';

import { isCurrentUserLoadedState } from '@/auth/states/isCurrentUserLoadingState';
import { currentUserState } from '@/auth/states/currentUserState';
import { currentOrganizationState } from '@/organization/states/currentOrganizationSate';
import { isCurrentOrganizationLoadedState } from '@/organization/states/currentOrganizationLoadingState';

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
