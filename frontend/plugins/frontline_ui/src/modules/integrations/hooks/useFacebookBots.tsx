import { FACEBOOK_BOTS_LIST } from '@/integrations/graphql/queries/facebookBots';
import { useQuery } from '@apollo/client';

export const useFacebookBots = () => {
  const { data, loading } = useQuery(FACEBOOK_BOTS_LIST);

  const { facebootMessengerBots = [] } = data || {};

  return {
    bots: facebootMessengerBots,
    loading,
  };
};
