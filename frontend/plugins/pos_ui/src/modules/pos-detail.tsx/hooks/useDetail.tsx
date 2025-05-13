import { useQuery, gql } from '@apollo/client';
import { queries } from '~/modules/graphql';

// Define response type for the query
interface PosDetailQueryResponse {
  posDetail: {
    _id: string;
    name: string;
    description?: string;
    orderPassword?: string;
    scopeBrandIds?: string[];
    pdomain?: string;
    createdAt: string;
    token?: string;
    erxesAppToken?: string;
    adminIds?: string[];
    cashierIds?: string[];
    paymentIds?: string[];
    paymentTypes?: string[];
    user?: {
      _id: string;
      details?: {
        avatar?: string;
        fullName?: string;
      };
    };
    isOnline?: boolean;
    onServer?: boolean;
    branchId?: string;
    departmentId?: string;
    allowBranchIds?: string[];
    beginNumber?: number;
    maxSkipNumber?: number;
    waitingScreen?: any;
    kitchenScreen?: any;
    kioskMachine?: any;
    uiOptions?: any;
    ebarimtConfig?: any;
    erkhetConfig?: any;
    cardsConfig?: any;
    catProdMappings?: {
      _id: string;
      categoryId: string;
      code: string;
      name: string;
      productId: string;
    }[];
    initialCategoryIds?: string[];
    kioskExcludeCategoryIds?: string[];
    kioskExcludeProductIds?: string[];
    deliveryConfig?: any;
    checkRemainder?: boolean;
    permissionConfig?: any;
    allowTypes?: string[];
    isCheckRemainder?: boolean;
    checkExcludeCategoryIds?: string[];
    banFractions?: boolean;
    branchTitle?: string;
    departmentTitle?: string;
    productDetails?: any;
  };
}

/**
 * Hook for fetching POS detail by ID
 * @param posId - ID of the POS to fetch details for
 * @returns Loading state, error state, POS detail data and refetch function
 */
export function usePosDetail(posId?: string) {
  const { loading, error, data, refetch } = useQuery<PosDetailQueryResponse>(
    gql(queries.posDetail),
    {
      skip: !posId,
      fetchPolicy: "cache-and-network",
      variables: {
        _id: posId || "",
        posId: posId || "",
      },
      errorPolicy: "all",
      onError: (error) => {
        console.error("PosDetail query error:", error.message);
      }
    }
  );

  const permissionError = error?.graphQLErrors?.some(
    e => e.message === "Permission required" || e.extensions?.code === "INTERNAL_SERVER_ERROR"
  );

  return {
    loading,
    error,
    permissionError,
    posDetail: data?.posDetail,
    refetch
  };
}