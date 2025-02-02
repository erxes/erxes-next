import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { useApolloClient, useMutation } from '@apollo/client';
import {
  currentOrganizationState,
  currentUserState,
  isCurrentOrganizationLoadedState,
  isCurrentUserLoadedState,
} from 'erxes-shared-states';
import { useSetRecoilState } from 'recoil';

import { Logout } from '@/auth/graphql/mutations/logout';
import { AppPath } from '@/types/paths/AppPath';

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

    navigate(AppPath.Login);
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
