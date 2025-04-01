import { OperationVariables, useMutation } from '@apollo/client';
import { mutations } from '@/settings/team-member/graphql';
import { IUsersDetails } from '../types';

export const useUsersDetailEdit = () => {
  const [_usersDetailEdit, { loading }] = useMutation(
    mutations.USERS_INLINE_EDIT,
  );

  const usersDetailEdit = (
    operationVariables: OperationVariables,
    fields: string[],
  ) => {
    console.log('-----------------')
    const variables = operationVariables?.variables || {};
    const fieldsToUpdate: Record<string, (existing: any) => any> = {};
    fields.forEach((field) => {
      fieldsToUpdate[field] = () => variables.details?.[field];
    });

    console.log(operationVariables)

    return _usersDetailEdit({
      ...operationVariables,
      variables,
      update: (cache, { data }) => {
        console.log(data)
        console.log('------')
        if (!data?.usersEdit) return;

        cache.modify({
          id: cache.identify(data.usersEdit),
          fields: {
            details(existingDetails = {}) {
              return {
                ...existingDetails,
                ...Object.fromEntries(
                  Object.entries(fieldsToUpdate).map(([key, updater]) => [
                    key,
                    updater(existingDetails[key]),
                  ]),
                ),
              };
            },
          },
        });
      },
    });
  };

  return { usersDetailEdit, loading };
};

export const useUserEdit = () => {
  const [_usersEdit, { loading }] = useMutation(mutations.USERS_INLINE_EDIT);

  const usersEdit = (
    operationVariables: OperationVariables,
    fields: string[],
  ) => {
    const variables = operationVariables?.variables || {};
    const fieldsToUpdate: Record<string, () => any> = {};
    fields.forEach((field) => {
      fieldsToUpdate[field] = () => variables[field];
    });
    console.log(variables,fieldsToUpdate)
    return _usersEdit({
      ...operationVariables,
      variables,
      update: (cache, { data: { usersEdit } }) => {
        console.log(usersEdit,cache,fieldsToUpdate);
        cache.modify({
          id: cache.identify(usersEdit),
          fields: fieldsToUpdate,
        });
      },
    });
  };

  return { usersEdit, loading };
};
