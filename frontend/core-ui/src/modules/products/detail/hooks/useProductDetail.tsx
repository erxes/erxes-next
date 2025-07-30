import { OperationVariables, useQuery } from '@apollo/client';
import { productCategoryDetail } from '../graphql/queries/productDetailQueries';
import { useSetAtom } from 'jotai';
import { renderingProductDetailAtom } from '../../states/productDetailStates';
import { useQueryState } from 'erxes-ui';

export const useProductDetail = (operationVariables?: OperationVariables) => {
  const [_id] = useQueryState('productId');
  const setRendering = useSetAtom(renderingProductDetailAtom);
  const { data, loading, error, refetch } = useQuery(productCategoryDetail, {
    variables: {
      _id,
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
  return {
    productDetail: data?.productDetail ?? null,
    loading,
    error,
    refetch,
  };
};
