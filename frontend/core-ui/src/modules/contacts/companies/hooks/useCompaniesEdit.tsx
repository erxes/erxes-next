import { OperationVariables, useMutation } from '@apollo/client';
import { EDIT_COMPANIES } from '@/contacts/companies/graphql/mutations/editCompanies';

export const useCompaniesEdit = () => {
  const [_companiesEdit, { loading }] = useMutation(EDIT_COMPANIES);

  const companiesEdit = (
    operationVariables: OperationVariables,
    fields: string[],
  ) => {
    const variables = operationVariables?.variables || {};
    const fieldsToUpdate: Record<string, () => any> = {};
    fields.forEach((field) => {
      fieldsToUpdate[field] = () => variables[field];
    });
    return _companiesEdit({
      ...operationVariables,
      variables,
      update: (cache, { data: { companiesEdit } }) => {
        cache.modify({
          id: cache.identify(companiesEdit),
          fields: fieldsToUpdate,
        });
      },
    });
  };

  return { companiesEdit, loading };
};
