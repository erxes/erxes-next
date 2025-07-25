import { MutationFunctionOptions, useMutation } from '@apollo/client';
import { UNSAFE_createClientRoutesWithHMRRevalidationOptOut } from 'react-router';
import { EDIT_CONTRACTTYPE } from '~/modules/contractTypes/graphql/mutation';

export const useContractTypeEdit = () => {
  const [editContractType, { loading }] = useMutation(EDIT_CONTRACTTYPE);

  return { editContractType, loading };
};

export const useContractTypeEditField = () => {
  const { editContractType, loading } = useContractTypeEdit();

  const editContractTypeField = (
    options: MutationFunctionOptions,
    skip = false,
  ) => {
    if (skip) return;

    editContractType({
      ...options,
      update: (cache, { data: { savingsContractTypesEdit } }) => {
        cache.modify({
          id: cache.identify(savingsContractTypesEdit),
          fields: Object.keys(options.variables || {}).reduce(
            (fields: any, field) => {
              fields[field] = () => (options.variables || {})[field];
              return fields;
            },
            {},
          ),
          optimistic: true,
        });
      },
    });
  };

  return {
    editContractTypeField,
    loading,
  };
};
