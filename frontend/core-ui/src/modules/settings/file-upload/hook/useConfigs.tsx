import { useMutation, useQuery } from '@apollo/client';

import { useToast } from 'erxes-ui';

import {
  fileSettingsMutations,
  fileSettingsQueries,
} from '@/settings/file-upload/graphql';

const useConfig = () => {
  const { toast } = useToast();

  const { data, loading } = useQuery(fileSettingsQueries.GET_CONFIGS, {
    onError(error) {
      console.error(error.message);
    },
  });

  const [update, { loading: isLoading }] = useMutation(
    fileSettingsMutations.UPDATE_CONFIGS,
    {
      onError(error) {
        console.error(error.message);
      },
      onCompleted() {
        toast({
          title: 'Success',
          description: 'configs updated successfully',
        });
      },
      refetchQueries: [
        {
          query: fileSettingsQueries.GET_CONFIGS,
        },
      ],
      awaitRefetchQueries: true,
    },
  );

  const updateConfig = (args: any) => {
    update({
      variables: {
        configsMap: {
          ...args,
        },
      },
    });
  };

  const configs = data?.configs || undefined;

  return {
    configs,
    loading,
    updateConfig,
    isLoading,
  };
};

export { useConfig };
