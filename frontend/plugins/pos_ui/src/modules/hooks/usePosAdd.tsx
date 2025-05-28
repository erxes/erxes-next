import { useMutation, ApolloCache, MutationHookOptions } from '@apollo/client';
import posMutations from '../graphql/mutations'; 
import posQueries from '../graphql/queries';

export interface PosData {
  _id: string;
  name: string;
  description: string;
  orderPassword?: string;
  scopeBrandIds?: string[];
  pdomain?: string;
  createdAt?: string;
  token?: string;
  erxesAppToken?: string;
  adminIds?: string[];
  cashierIds?: string[];
  paymentIds?: string[];
  paymentTypes?: any[];
  user?: {
    _id: string;
    details: {
      avatar?: string;
      fullName?: string;
    };
  };
  isOnline?: boolean;
  onServer?: boolean;
  branchId?: string;
  departmentId?: string;
  allowBranchIds?: string[];
  beginNumber?: string;
  maxSkipNumber?: number;
  waitingScreen?: any;
  kitchenScreen?: any;
  kioskMachine?: any;
  uiOptions?: any;
  ebarimtConfig?: any;
  erkhetConfig?: any;
  cardsConfig?: any;
  catProdMappings?: Array<{
    _id: string;
    categoryId: string;
    code: string;
    name: string;
    productId: string;
  }>;
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
  productDetails?: string[];
}

export interface AddPosDetailResult {
  posAdd: PosData;
}

export interface AddPosDetailVariables {
  name: string;
  description: string;
  orderPassword?: string;
  scopeBrandIds?: string[];
  pdomain?: string;
  erxesAppToken?: string;
  productDetails?: string[];
  adminIds?: string[];
  cashierIds?: string[];
  paymentIds?: string[];
  paymentTypes?: any[];
  isOnline?: boolean;
  onServer?: boolean;
  branchId?: string;
  departmentId?: string;
  allowBranchIds?: string[];
  beginNumber?: string;
  maxSkipNumber?: number;
  kitchenScreen?: any;
  waitingScreen?: any;
  kioskMachine?: any;
  uiOptions?: any;
  ebarimtConfig?: any;
  erkhetConfig?: any;
  cardsConfig?: any;
  catProdMappings?: any[];
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
}

export interface UpdatePosDetailResult {
  posEdit: PosData;
}

export interface UpdatePosDetailVariables extends AddPosDetailVariables {
  _id: string;
}

export interface PosListData {
  posList: PosData[];
}

export function useAddPosDetail(
  options?: MutationHookOptions<AddPosDetailResult, AddPosDetailVariables>,
) {
  const [posAdd, { loading, error }] = useMutation<
    AddPosDetailResult,
    AddPosDetailVariables
  >(posMutations.posAdd, {
    ...options,
    update: (cache: ApolloCache<any>, { data }) => {
      try {
        const queryVariables = { perPage: 30 };

        const existingData = cache.readQuery<{ posList: PosData[] }>({
          query: posQueries.posList,
          variables: queryVariables,
        });

        if (
          !existingData ||
          !existingData.posList ||
          !data?.posAdd
        )
          return;

        cache.writeQuery<{ posList: PosData[] }>({
          query: posQueries.posList,
          variables: queryVariables,
          data: {
            posList: [...existingData.posList, data.posAdd],
          },
        });
      } catch (e) {
        console.error('Cache update error:', e);
      }
    },
  });

  return { posAdd, loading, error };
}

// Additional hook for updating POS details
export interface UpdatePosDetailResult {
  posDetailUpdate: PosDetailFormValues & { id: string };
}

export interface UpdatePosDetailVariables {
  id: string;
  input: Partial<PosDetailFormValues>;
}

export function useUpdatePosDetail(
  options?: MutationHookOptions<UpdatePosDetailResult, UpdatePosDetailVariables>,
) {
  const [posEdit, { loading, error }] = useMutation<
    UpdatePosDetailResult,
    UpdatePosDetailVariables
  >(posMutations.posEdit, {
    ...options,
    update: (cache: ApolloCache<any>, { data }) => {
      try {
        const queryVariables = { perPage: 30 };

        const existingData = cache.readQuery<{ posList: PosData[] }>({
          query: posQueries.posList,
          variables: queryVariables,
        });

        if (
          !existingData ||
          !existingData.posList ||
          !data?.posEdit
        )
          return;

        const updatedList = existingData.posList.map(item =>
          item._id === data.posEdit._id ? data.posEdit : item
        );

        cache.writeQuery<{ posList: PosData[] }>({
          query: posQueries.posList,
          variables: queryVariables,
          data: {
            posList: updatedList,
          },
        });
      } catch (e) {
        console.error('Cache update error:', e);
      }
    },
  });

  return { posEdit, loading, error };
}

// Hook for multi-step form submission
export function useSubmitPosForm() {
  const { posAdd, loading: addLoading, error: addError } = useAddPosDetail();
  
  const submitForm = async (formData: FormStepData) => {
    try {
      const combinedData = combineFormData(formData);
      
      // Validate the combined data
      const validatedData = posDetailSchema.parse(combinedData);
      
      // Convert your schema data to the GraphQL mutation variables format
      const variables: AddPosDetailVariables = {
        name: validatedData.name,
        description: validatedData.description,
        adminIds: validatedData.adminIds,
        cashierIds: validatedData.cashierIds,
        scopeBrandIds: validatedData.scopeBrandIds,
        allowBranchIds: validatedData.allowBranchIds,
        productDetails: validatedData.productDetails?.map(pd => pd.productId),
        paymentIds: validatedData.paymentIds,
        paymentTypes: validatedData.paymentTypes,
        beginNumber: validatedData.beginNumber,
        maxSkipNumber: validatedData.maxSkipNumber,
        uiOptions: validatedData.uiOptions,
        catProdMappings: validatedData.catProdMappings,
        initialCategoryIds: validatedData.initialCategoryIds,
        kioskExcludeCategoryIds: validatedData.kioskExcludeCategoryIds,
        kioskExcludeProductIds: validatedData.kioskExcludeProductIds,
        checkRemainder: validatedData.checkRemainder,
        permissionConfig: validatedData.permissionConfig,
        allowTypes: validatedData.allowTypes,
        checkExcludeCategoryIds: validatedData.checkExcludeCategoryIds,
      };
      
      const result = await posAdd({
        variables
      });
      
      return result;
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  };
  
  return {
    submitForm,
    loading: addLoading,
    error: addError
  };
}

// Hook to remove POS
export function useRemovePosDetail() {
  const [posRemove, { loading, error }] = useMutation<
    { posRemove: string },
    { _id: string }
  >(posMutations.posRemove, {
    update: (cache: ApolloCache<any>, { data }, { variables }) => {
      try {
        const queryVariables = { perPage: 30 };

        const existingData = cache.readQuery<{ posList: PosData[] }>({
          query: posQueries.posList,
          variables: queryVariables,
        });

        if (!existingData || !existingData.posList || !variables?._id) return;

        const filteredList = existingData.posList.filter(
          item => item._id !== variables._id
        );

        cache.writeQuery<{ posList: PosData[] }>({
          query: posQueries.posList,
          variables: queryVariables,
          data: {
            posList: filteredList,
          },
        });
      } catch (e) {
        console.error('Cache update error:', e);
      }
    },
  });

  return { posRemove, loading, error };
}

// Import the required types and functions from your schema
import { combineFormData, FormStepData, PosDetailFormValues, posDetailSchema } from '../create-pos/components/formSchema';