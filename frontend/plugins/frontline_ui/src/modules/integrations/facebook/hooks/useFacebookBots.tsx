import {
  FACEBOOK_BOTS_LIST,
  GET_FACEBOOK_BOT_PROFILE,
} from '@/integrations/facebook/graphql/queries/facebookBots';
import { IFacebookBot } from '@/integrations/facebook/types/FacebookBot';
import { useQuery } from '@apollo/client';

export const useFacebookBots = () => {
  const { data, loading } = useQuery<{ facebootMessengerBots: IFacebookBot[] }>(
    FACEBOOK_BOTS_LIST,
  );

  const { facebootMessengerBots = [] } = data || {};

  return {
    bots: facebootMessengerBots,
    loading,
  };
};

export const useFacebookBot = (botId: string) => {
  const { data, loading } = useQuery<{ facebootMessengerBot: IFacebookBot }>(
    GET_FACEBOOK_BOT_PROFILE,
    {
      variables: { _id: botId },
      skip: !botId,
    },
  );

  const { facebootMessengerBot } = data || {};

  return {
    bot: facebootMessengerBot,
    loading,
  };
};
