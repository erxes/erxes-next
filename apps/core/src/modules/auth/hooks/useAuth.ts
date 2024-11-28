import { useApolloClient, useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { Login } from '@/auth/graphql/mutations/login';
import { Logout } from '@/auth/graphql/mutations/logout';
import { isCurrentUserLoadedState } from '@/auth/states/isCurrentUserLoadingState';
import { currentUserState } from '@/auth/states/currentUserState';

import {
  snapshot_UNSTABLE,
  useGotoRecoilSnapshot,
  useRecoilCallback,
} from 'recoil';

export const useAuth = () => {
  const [login] = useMutation(Login);
  const [logout] = useMutation(Logout);

  const client = useApolloClient();

  const goToRecoilSnapshot = useGotoRecoilSnapshot();

  const handleCrendentialsLogin = useCallback(
    async (email: string, password: string) => {
      await login({ variables: { email, password } }).catch((e) => {
        console.log(e);
      });
    },
    [login]
  );

  const handleLogout = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const emptySnapshot = snapshot_UNSTABLE();
        await logout();

        const isCurrentUserLoaded = snapshot
          .getLoadable(isCurrentUserLoadedState)
          .getValue();

        const currentUser = snapshot.getLoadable(currentUserState).getValue();

        const initialSnapshot = emptySnapshot.map(({ set }) => {
          set(isCurrentUserLoadedState, isCurrentUserLoaded);
          set(currentUserState, currentUser);
          return undefined;
        });

        goToRecoilSnapshot(initialSnapshot);

        await client.clearStore();
        sessionStorage.clear();
        localStorage.clear();
      },
    [client, goToRecoilSnapshot]
  );

  return {
    handleLogout,
    handleCrendentialsLogin,
  };
};
