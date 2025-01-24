import { useMutation, useQuery } from '@apollo/client';
import { useToast } from 'erxes-ui/hooks';
import {
  SettingsMutations,
  SettingsQueries,
} from '@/settings/file-upload/graphql';

type TList = {
  onCompleted: (data) => void;
};

const useConfig = ({ onCompleted }: TList) => {
  const { toast } = useToast();

  const { data, loading } = useQuery(SettingsQueries.configsQuery, {
    fetchPolicy: 'network-only',
    onCompleted,
  });

  const [update, { loading: isLoading }] = useMutation(
    SettingsMutations.configsUpdate,
    {
      onError(error) {
        console.log(error.message);
      },
      onCompleted() {
        toast({
          title: 'Success',
          description: 'configs updated successfully',
        });
      },
      refetchQueries: ['configsQuery'],
    }
  );

  const updateConfig = (args) => {
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
