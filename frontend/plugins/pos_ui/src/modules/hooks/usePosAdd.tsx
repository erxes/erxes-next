import { useMutation, ApolloCache, MutationHookOptions } from '@apollo/client';
import posMutations from '../graphql/mutations';
import posQueries from '../graphql/queries';
import {
  combineFormData,
  FormStepData,
  PosDetailFormValues,
  posDetailSchema,
} from '../create-pos/components/formSchema';
import {
  AddPosDetailResult,
  AddPosDetailVariables,
  PosData,
} from '../types/mutations';

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

        if (!existingData?.posList || !data?.posAdd) return;

        cache.writeQuery<{ posList: PosData[] }>({
          query: posQueries.posList,
          variables: queryVariables,
          data: {
            posList: [...existingData.posList, data.posAdd],
          },
        });
      } catch (error) {
        console.error('Cache update error:', error);
      }
    },
  });

  return { posAdd, loading, error };
}

export interface UpdatePosDetailResult {
  posDetailUpdate: PosDetailFormValues & { id: string };
}

export interface UpdatePosDetailVariables {
  id: string;
  input: Partial<PosDetailFormValues>;
}

export function useSubmitPosForm() {
  const { posAdd, loading: addLoading, error: addError } = useAddPosDetail();

  const submitForm = async (formData: FormStepData) => {
    try {
      const combinedData = combineFormData(formData);
      const validatedData = posDetailSchema.parse(combinedData);

      const variables: AddPosDetailVariables = {
        name: validatedData.name,
        description: validatedData.description,
        adminIds: validatedData.adminIds,
        cashierIds: validatedData.cashierIds,
        scopeBrandIds: validatedData.scopeBrandIds,
        branchId: validatedData.branchId,
        departmentId: validatedData.departmentId,
        productDetails: validatedData.productDetails?.map((pd) => pd.productId),
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

      const result = await posAdd({ variables });
      return result;
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  };

  return {
    submitForm,
    loading: addLoading,
    error: addError,
  };
}

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

        if (!existingData?.posList || !variables?._id) return;

        const filteredList = existingData.posList.filter(
          (item) => item._id !== variables._id,
        );

        cache.writeQuery<{ posList: PosData[] }>({
          query: posQueries.posList,
          variables: queryVariables,
          data: {
            posList: filteredList,
          },
        });
      } catch (error) {
        console.error('Cache update error:', error);
      }
    },
  });

  return { posRemove, loading, error };
}
