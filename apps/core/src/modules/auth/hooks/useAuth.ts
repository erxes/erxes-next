import { useCallback } from 'react';
import {
  snapshot_UNSTABLE,
  useGotoRecoilSnapshot,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState,
} from 'recoil';

import { isVerifyPendingState } from '@/auth/states/isVerifyPendingState';

import { isDefined } from 'erxes-ui';

import { currentUserState } from '@/auth/states/currentUserState';
import { tokenPairState } from '@/auth/states/tokenPairState';
import { isCurrentUserLoadedState } from '@/auth/states/isCurrentUserLoadingState';

export const useAuth = () => {
  const [, setTokenPair] = useRecoilState(tokenPairState);
  const setCurrentUser = useSetRecoilState(currentUserState);

  const setIsVerifyPendingState = useSetRecoilState(isVerifyPendingState);

  // const [challenge] = useChallengeMutation();
  // const [signUp] = useSignUpMutation();
  // const [verify] = useVerifyMutation();
  // const [checkUserExistsQuery, { data: checkUserExistsData }] =
  //   useCheckUserExistsLazyQuery();

  const goToRecoilSnapshot = useGotoRecoilSnapshot();

  const handleVerify = useCallback(
    async (loginToken: string) => {
      const verifyResult = await verify({
        variables: { loginToken },
      });

      if (isDefined(verifyResult.errors)) {
        throw verifyResult.errors;
      }

      if (!verifyResult.data?.verify) {
        throw new Error('No verify result');
      }

      setTokenPair(verifyResult.data?.verify.tokens);

      const user = verifyResult.data?.verify.user;

      setCurrentUser(user);

      return {
        user,
        tokens: verifyResult.data?.verify.tokens,
      };
    },
    [setTokenPair, setCurrentUser]
  );

  const handleCrendentialsSignIn = useCallback(
    async (email: string, password: string, captchaToken?: string) => {
      const { loginToken } = await handleChallenge(
        email,
        password,
        captchaToken
      );
      setIsVerifyPendingState(true);

      const { user } = await handleVerify(loginToken.token);

      setIsVerifyPendingState(false);

      return {
        user,
      };
    },
    [handleVerify, setIsVerifyPendingState]
  );

  const handleSignOut = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const emptySnapshot = snapshot_UNSTABLE();

        const authProvidersValue = snapshot
          .getLoadable(authProvidersState)
          .getValue();
        const billing = snapshot.getLoadable(billingState).getValue();
        const isSignInPrefilled = snapshot
          .getLoadable(isSignInPrefilledState)
          .getValue();
        const supportChat = snapshot.getLoadable(supportChatState).getValue();
        const isDebugMode = snapshot.getLoadable(isDebugModeState).getValue();
        const captchaProvider = snapshot
          .getLoadable(captchaProviderState)
          .getValue();
        const isClientConfigLoaded = snapshot
          .getLoadable(isClientConfigLoadedState)
          .getValue();
        const isCurrentUserLoaded = snapshot
          .getLoadable(isCurrentUserLoadedState)
          .getValue();

        const initialSnapshot = emptySnapshot.map(({ set }) => {
          set(authProvidersState, authProvidersValue);
          set(billingState, billing);
          set(isSignInPrefilledState, isSignInPrefilled);
          set(supportChatState, supportChat);
          set(isDebugModeState, isDebugMode);
          set(captchaProviderState, captchaProvider);
          set(isClientConfigLoadedState, isClientConfigLoaded);
          set(isCurrentUserLoadedState, isCurrentUserLoaded);
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
    challenge: handleChallenge,
    verify: handleVerify,

    checkUserExists: { checkUserExistsData, checkUserExistsQuery },

    signOut: handleSignOut,
    signUpWithCredentials: handleCredentialsSignUp,
    signInWithCredentials: handleCrendentialsSignIn,
  };
};
