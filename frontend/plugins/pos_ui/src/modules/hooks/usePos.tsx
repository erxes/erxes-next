import { useQuery, useMutation, gql } from '@apollo/client';
import { useEffect } from 'react';
import { queries, mutations } from '../graphql';

// Define response types for queries and mutations
interface PosListQueryResponse {
  posList: {
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
  }[];
}

interface RemoveMutationResponse {
  posRemove: string;
}

interface QueryParams {
  page?: string | number;
  perPage?: string | number;
  status?: string;
  sortField?: string;
  sortDirection?: string | number;
  [key: string]: any;
}

interface RouterInterface {
  generatePaginationParams: (params: QueryParams) => {
    page?: number;
    perPage?: number;
    [key: string]: any;
  };
}

interface ConfirmFunction {
  (message: string): Promise<boolean>;
}

interface AlertInterface {
  success: (message: string) => void;
  error: (message: string) => void;
}

/**
 * Custom hook for managing POS list operations including querying, pagination, and removal
 * 
 * @param router - Router object with pagination helper methods
 * @param queryParams - Query parameters for filtering and pagination
 * @param shouldRefetchList - Boolean flag to trigger refetch
 * @param confirm - Confirmation function that returns a Promise
 * @param Alert - Alert interface for showing success/error messages
 * @returns Object containing list data, loading state, error state, and management functions
 */
export function usePosListManager({
  router,
  queryParams = {},
  shouldRefetchList = false,
  confirm,
  Alert
}: {
  router: RouterInterface;
  queryParams: QueryParams;
  shouldRefetchList?: boolean;
  confirm: ConfirmFunction;
  Alert: AlertInterface;
}) {
  // Query for POS list with pagination and sorting
  const posListQuery = useQuery<PosListQueryResponse>(gql(queries.posList), {
    variables: {
      ...router.generatePaginationParams(queryParams || {}),
      status: queryParams.status,
      sortField: queryParams.sortField,
      sortDirection: queryParams.sortDirection
        ? parseInt(String(queryParams.sortDirection), 10)
        : undefined,
    },
    fetchPolicy: 'network-only',
    errorPolicy: "all",
    onError: (error) => {
      console.error("PosList query error:", error.message);
    }
  });

  // Mutation for removing a POS
  const [posRemove] = useMutation<RemoveMutationResponse>(
    gql(mutations.posRemove),
    {
      onError: (error) => {
        console.error("PosRemove mutation error:", error.message);
      }
    }
  );

  // Refetch when page changes
  useEffect(() => {
    refetch();
  }, [queryParams.page]);

  // Refetch when shouldRefetchList flag changes
  useEffect(() => {
    if (shouldRefetchList) {
      refetch();
    }
  }, [shouldRefetchList]);

  // Refetch function to refresh the list
  const refetch = () => {
    posListQuery.refetch();
  };

  // Remove function with confirmation
  const remove = (posId: string) => {
    const message = 'Are you sure?';

    confirm(message).then(() => {
      posRemove({
        variables: { _id: posId },
      })
        .then(() => {
          // refresh queries
          refetch();

          Alert.success('You successfully deleted a pos.');
        })
        .catch((e) => {
          Alert.error(e.message);
        });
    });
  };

  // Check for permission error
  const permissionError = posListQuery.error?.graphQLErrors?.some(
    e => e.message === "Permission required" || e.extensions?.code === "INTERNAL_SERVER_ERROR"
  );

  return {
    loading: posListQuery.loading,
    error: posListQuery.error,
    permissionError,
    posList: posListQuery.data?.posList || [],
    refetch,
    remove
  };
}