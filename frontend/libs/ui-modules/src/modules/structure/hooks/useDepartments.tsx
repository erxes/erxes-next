import { useQuery } from '@apollo/client';
import { GET_DEPARTMENTS } from '../graphql/queries/getDepartments';
import { OperationVariables } from '@apollo/client';
import { IDepartment } from '../types/Department';

export const useDepartments = (options?: OperationVariables) => {
  const { data, loading } = useQuery<{ departments: IDepartment[] }>(
    GET_DEPARTMENTS,
    options,
  );
  const { departments } = data || {};

  return { departments, loading };
};
