import { OperationVariables, useQuery } from '@apollo/client';
import { GET_COMPANY_DETAIL } from '@/contacts/companies/graphql/queries/getCompanyDetail';
import { renderingCompanyDetailAtom } from '@/contacts/states/companyDetailStates';
import { useSetAtom } from 'jotai';
import { useQueryState } from 'erxes-ui';

export const useCompanyDetail = (operationVariables?: OperationVariables) => {
  const [_id] = useQueryState('companyId');
  const setRendering = useSetAtom(renderingCompanyDetailAtom);
  const { data, loading } = useQuery(GET_COMPANY_DETAIL, {
    variables: {
      id: _id,
    },
    skip: !_id,
    ...operationVariables,
    onCompleted: (data) => {
      setRendering(false);
      operationVariables?.onCompleted?.(data);
    },
    onError: (error) => {
      setRendering(false);
      operationVariables?.onError?.(error);
    },
  });

  return { companyDetail: data?.companyDetail, loading };
};
