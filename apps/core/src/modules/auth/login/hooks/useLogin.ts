import { useApolloClient, useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { Login } from '@/auth/graphql/mutations/login';
import { Logout } from '@/auth/graphql/mutations/logout';
import { ForgotPassword } from '@/auth/graphql/mutations/forgotPassword';
import { ResetPassword } from '@/auth/graphql/mutations/resetPassword';

import { isCurrentUserLoadedState } from '@/auth/states/isCurrentUserLoadingState';
import { currentUserState } from '@/auth/states/currentUserState';

import { useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { useToast } from 'erxes-ui';

export const useLogin = () => {
  const [login] = useMutation(Login);
  const [logout] = useMutation(Logout);
  const [forgotPassword] = useMutation(ForgotPassword);
  const [resetPassword] = useMutation(ResetPassword);
  const setCurrentUser = useSetRecoilState(currentUserState);
  const setIsCurrentUserLoaded = useSetRecoilState(isCurrentUserLoadedState);
  const { toast } = useToast();

  const navigate = useNavigate();

  const client = useApolloClient();

  const handleCrendentialsLogin = useCallback(
    async (email: string, password: string) => {
      await login({ variables: { email, password } })
        .then((response) => {
          setIsCurrentUserLoaded(false);
          response.data && navigate('/');
        })
        .catch((e) => {
          console.log(e);
        });
    },
    [login, navigate, setIsCurrentUserLoaded]
  );

  const handleLogout = useCallback(async () => {
    await logout();
    client.resetStore();

    setIsCurrentUserLoaded(false);
    setCurrentUser(undefined);

    sessionStorage.clear();
    localStorage.clear();

    navigate('/login');
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
        })
        .catch((e) => {
          toast({
            title: 'Uh oh! Something went wrong.',
            description: e.message,
          });
        });
    },
    [forgotPassword, toast]
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
    [resetPassword, toast]
  );

  return {
    handleLogout,
    handleCrendentialsLogin,
    handleForgotPassword,
    handleResetPassword,
  };
};
