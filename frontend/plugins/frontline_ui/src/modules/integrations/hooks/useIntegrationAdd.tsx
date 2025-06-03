import { useMutation } from '@apollo/client';
import { ADD_INTEGRATION } from '../graphql/mutations/AddIntegration';

export const useIntegrationAdd = () => {
  const [addIntegration, { loading }] = useMutation(ADD_INTEGRATION);

  return {
    addIntegration,
    loading,
  };
};
