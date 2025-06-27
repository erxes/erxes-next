import { EDIT_INTEGRATION } from '@/integrations/graphql/mutations/EditIntegration';
import { useMutation, MutationFunctionOptions } from '@apollo/client';

export const useIntegrationEdit = () => {
  const [editIntegration, { loading }] = useMutation(EDIT_INTEGRATION);

  return {
    editIntegration,
    loading,
  };
};

export const useIntegrationEditField = (
  cellData: MutationFunctionOptions['variables'],
) => {
  const { editIntegration, loading } = useIntegrationEdit();

  const editIntegrationField = (
    options: MutationFunctionOptions,
    skip = false,
  ) => {
    if (skip) return;

    editIntegration({
      ...options,
      variables: {
        ...cellData,
        ...options.variables,
      },
    });
  };

  return {
    editIntegrationField,
    loading,
  };
};
