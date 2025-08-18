import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { useApolloClient, useMutation } from '@apollo/client';
import { currentUserState, isCurrentUserLoadedState } from 'ui-modules';

import { toast } from 'erxes-ui';

import { Logout } from '@/auth/graphql/mutations/logout';
import { ForgotPassword } from '@/auth/login/grahpql/mutations/forgotPassword';
import { Login } from '@/auth/login/grahpql/mutations/login';
import { ResetPassword } from '@/auth/login/grahpql/mutations/resetPassword';
import { AppPath } from '@/types/paths/AppPath';
import { useSetAtom } from 'jotai';

export const useLogin = () => {
  const [login] = useMutation(Login);
  const [logout] = useMutation(Logout);
  const [forgotPassword] = useMutation(ForgotPassword);
  const [resetPassword] = useMutation(ResetPassword);
  const setCurrentUser = useSetAtom(currentUserState);
  const setIsCurrentUserLoaded = useSetAtom(isCurrentUserLoadedState);

  const navigate = useNavigate();

  const client = useApolloClient();

  const handleCrendentialsLogin = useCallback(
    async (email: string, password: string) => {
      await login({ variables: { email, password } })
        .then((response) => {
          setIsCurrentUserLoaded(false);
          return response.data && navigate(AppPath.Index);
        })
        .catch((e) => {
          toast({
            title: 'Email or password is incorrect',
            description: e.message,
          });
        });
    },
    [login, navigate, setIsCurrentUserLoaded],
  );

  const handleLogout = useCallback(async () => {
    await logout();
    client.resetStore();

    setIsCurrentUserLoaded(false);
    setCurrentUser(null);

    sessionStorage.clear();
    localStorage.clear();

    navigate(AppPath.Login);
  }, [logout, navigate, setCurrentUser, setIsCurrentUserLoaded, client]);

  const handleForgotPassword = useCallback(
    async (email: string) => {
      await forgotPassword({ variables: { email } })
        .then(() => {
          toast({
            title: 'Success',
            description:
              'Password reset instructions have been sent to your email.',
          });
          navigate(AppPath.Login);
        })
        .catch((e) => {
          toast({
            title: 'Uh oh! Something went wrong.',
            description: e.message,
          });
        });
    },
    [forgotPassword, toast],
  );

  const handleResetPassword = useCallback(
    async (token: string, password: string) => {
      await resetPassword({ variables: { token, newPassword: password } })
        .then(() => {
          toast({
            title: 'Success',
            description: 'Password has been reset.',
          });
        })
        .catch((e) => {
          toast({
            title: 'Uh oh! Something went wrong.',
            description: e.message,
          });
        });
    },
    [resetPassword, toast],
  );

  return {
    handleLogout,
    handleCrendentialsLogin,
    handleForgotPassword,
    handleResetPassword,
  };
};
