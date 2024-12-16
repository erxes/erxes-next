import { useMutation, useQuery } from "@apollo/client"
import { SettingsMutations, SettingsQueries } from "../graphql"
import { useToast } from "erxes-ui/hooks";

const useConfigsUpdate = () => {
  const { toast } = useToast();
  const [ update, { loading } ] = useMutation(SettingsMutations.configsUpdate, {
    onError(error) {
      console.log(error.message)
    },
    onCompleted() {
      toast({
        title: 'Success',
        description: 'configs updated successfully'
      })
    },
    refetchQueries: ['configsQuery']
  });

  const updateConfig = (args) => {
    update({
      variables: {
        configsMap: {
          ...args
        }
      }
    })
  }

  return {
    updateConfig,
    loading
  }
}

const useConfigsList = () => {
  const { data, loading } = useQuery(SettingsQueries.configsQuery, {
    onError(error) {
      console.log(error.message)
    },
  })

  const { configs } = data || [];
  return {
    configs,
    loading
  }
}

export {
  useConfigsList,
  useConfigsUpdate
}