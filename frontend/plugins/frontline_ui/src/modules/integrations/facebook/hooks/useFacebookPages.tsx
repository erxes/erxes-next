import { useQuery } from '@apollo/client';
import { GET_FB_PAGES } from '../graphql/queries/fbAccounts';
import { useAtomValue } from 'jotai';
import { selectedFacebookAccountAtom } from '../states/facebookStates';
import { IntegrationType } from '@/types/Integration';

export const useFacebookPages = () => {
  const selectedAccount = useAtomValue(selectedFacebookAccountAtom);
  const { data, loading, error } = useQuery<{
    facebookGetPages: {
      id: string;
      name: string;
      isUsed: boolean;
    }[];
  }>(GET_FB_PAGES, {
    variables: {
      accountId: selectedAccount,
      kind: IntegrationType.FACEBOOK_MESSENGER,
    },
  });

  const { facebookGetPages = [] } = data || {};

  return { facebookGetPages, loading, error };
};
