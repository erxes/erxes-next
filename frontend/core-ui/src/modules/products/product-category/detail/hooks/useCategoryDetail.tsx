import { OperationVariables, useQuery } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { renderingCategoryDetailAtom } from '../../states/ProductCategory';
import { productsQueries } from '@/products/graphql';

export const useProductCategoryDetail = (operationVariables?: OperationVariables) => {
  const [searchParams] = useSearchParams();
  const _id = searchParams.get('category_id'); 
  const setRendering = useSetAtom(renderingCategoryDetailAtom);

  const { data, loading, error } = useQuery(productsQueries.productCategoryDetail, {
    variables: { _id },
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
    categoryDetail: data?.productCategoryDetail ?? null,
    loading,
    error,
  };
};
