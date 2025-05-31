import { useQuery, QueryHookOptions } from '@apollo/client';

import { BRANDS_QUERY } from '../graphql/queries/BrandsQuery';

import { IBrand } from '../types/brand';
import {
  EnumCursorDirection,
  ICursorListResponse,
  mergeCursorData,
  validateFetchMore,
} from 'erxes-ui';

const BRANDS_PER_PAGE = 20;

export const useBrands = (
  options?: QueryHookOptions<ICursorListResponse<IBrand>>,
) => {
  const { data, loading, fetchMore, error } = useQuery<
    ICursorListResponse<IBrand>
  >(BRANDS_QUERY, {
    ...options,
    variables: {
      perPage: BRANDS_PER_PAGE,
      page: 1,
      ...options?.variables,
    },
  });

  const { list: brands, totalCount, pageInfo } = data?.brands || {};

  const handleFetchMore = ({
    direction = EnumCursorDirection.FORWARD,
  }: {
    direction?: EnumCursorDirection;
  }) => {
    if (!validateFetchMore({ direction, pageInfo })) return;

    fetchMore({
      variables: {
        cursor:
          direction === EnumCursorDirection.FORWARD
            ? pageInfo?.endCursor
            : pageInfo?.startCursor,
        limit: BRANDS_PER_PAGE,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          brands: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.brands,
            prevResult: prev.brands,
          }),
        });
      },
    });
  };

  return {
    brands,
    loading,
    error,
    handleFetchMore,
    totalCount,
  };
};
