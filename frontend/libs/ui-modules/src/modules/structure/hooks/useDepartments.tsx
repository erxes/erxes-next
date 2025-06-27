import { useQuery } from '@apollo/client';
import { GET_DEPARTMENTS } from '../graphql/queries/getDepartments';
import { OperationVariables } from '@apollo/client';
import { IDepartment } from '../types/Department';

interface IQueryResult {
  departmentsMain: {
    list: IDepartment[];
    totalCount?: number;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
}

export const useDepartments = (options?: OperationVariables) => {
  const { data, loading, error } = useQuery<IQueryResult>(
    GET_DEPARTMENTS,
    options,
  );
  const departments = data?.departmentsMain.list || [];
  const totalCount = data?.departmentsMain?.totalCount || 0;

  return { departments, loading, error, totalCount };
};
