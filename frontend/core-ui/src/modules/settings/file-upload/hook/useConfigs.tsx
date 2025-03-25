import { useMutation, useQuery } from '@apollo/client';

import { useToast } from 'erxes-ui';

import {
  fileSettingsMutations,
  fileSettingsQueries,
} from '@/settings/file-upload/graphql';

const useConfig = () => {
  const { toast } = useToast();

  const { data, loading } = useQuery(fileSettingsQueries.configsQuery, {
    onError(error) {
      // console.log(error.message);
    },
  });

  const [update, { loading: isLoading }] = useMutation(
    fileSettingsMutations.configsUpdate,
    {
      onError(error) {
        // console.log(error.message);
      },
      onCompleted() {
        toast({
          title: 'Success',
          description: 'configs updated successfully',
        });
      },
      refetchQueries: [
        {
          query: fileSettingsQueries.configsQuery,
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

  const configs = data?.configs || [];

  return {
    configs,
    loading,
    updateConfig,
    isLoading,
  };
};

export { useConfig };
