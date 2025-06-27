import { FACEBOOK_BOT_DETAIL } from '@/integrations/facebook/graphql/queries/facebookBots';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'erxes-ui';
import { useState } from 'react';
import { z } from 'zod';
import {
  ADD_FACEBOOK_BOT,
  UPDATE_FACEBOOK_BOT,
} from '~/widgets/automations/modules/facebook/components/bots/graphql/automationBotsMutations';
import { facebookBotFormSchema } from '~/widgets/automations/modules/facebook/components/bots/states/facebookBotForm';
import { FacebookBotDetailQueryResponse } from '~/widgets/automations/modules/facebook/components/bots/types/facebookBotTypes';

/**
 * Custom hook to manage form state for a Facebook bot.
 *
 * @param facebookBotId - The ID of the Facebook bot to load data for.
 *                        If null, a new bot form will be initialized.
 */

export const useFacebookBotForm = (facebookBotId: string | null) => {
  const { data, loading: loadingDetail } =
    useQuery<FacebookBotDetailQueryResponse>(FACEBOOK_BOT_DETAIL, {
      variables: { _id: facebookBotId },
      skip: !facebookBotId,
    });
  const [isOptionalOpen, setOptionalOpen] = useState(false);
  const [save, { loading: onSaveloading }] = useMutation(
    facebookBotId ? UPDATE_FACEBOOK_BOT : ADD_FACEBOOK_BOT,
  );

  const { facebookMessengerBot } = data || {};

  const onSave = (values: z.infer<typeof facebookBotFormSchema>) => {
    return save({ variables: values })
      .then(() => {
        toast({
          title: 'Save successfull',
        });
      })
      .catch((error) =>
        toast({
          variant: 'destructive',
          title: 'Something went wrong',
          description: error?.message,
        }),
      );
  };

  return {
    facebookMessengerBot,
    loadingDetail,
    isOptionalOpen,
    setOptionalOpen,
    onSaveloading,
    onSave,
  };
};
