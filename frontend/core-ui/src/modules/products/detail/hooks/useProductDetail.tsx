import { OperationVariables, useQuery } from '@apollo/client';
import { useQueryState } from 'nuqs';
import { productCategoryDetail } from '../graphql/queries/productDetailQueries';
import { useSetAtom } from 'jotai';
import { renderingProductDetailAtom } from '../../states/productDetailStates';

export const useProductDetail = (operationVariables?: OperationVariables) => {
  const [_id] = useQueryState('product_id');
  const setRendering = useSetAtom(renderingProductDetailAtom);
  const { data, loading } = useQuery(productCategoryDetail, {
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
  return { productDetail: data?.productDetail ?? null, loading   };
};
