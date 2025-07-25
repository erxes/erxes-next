import { Sheet, useToast } from 'erxes-ui';
import { useQueryState } from 'erxes-ui';
import { useContractTypeDetail } from '@/contractTypes/hooks/useContractTypeDetail';
import {
  contractTypeFormSchema,
  ContractTypeFormValues,
} from '~/modules/contractTypes/components/formSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApolloError } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { AddContractTypeForm } from '~/modules/contractTypes/components/AddContractType';
import { useContractTypeEditField } from '~/modules/contractTypes/hooks/useContractTypeEdit';
import { contractTypeQueries } from '~/modules/contractTypes/graphql/queries';
import { IContractType } from '~/modules/contractTypes/types';
export const ContractsTypeDetail = () => {
  const [contractTypeId, setContractTypeId] = useQueryState('contractTypeId');
  const { savingsContractTypeDetail, loading } = useContractTypeDetail(
    contractTypeId as string | null,
  );

  if (loading) return <>....</>;

  return (
    <Sheet
      open={!!contractTypeId}
      onOpenChange={() => {
        setContractTypeId(null);
      }}
    >
      <Sheet.View
        className="sm:max-w-lg p-0"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <ContractTypeDetailSheetHeader />
        <ContractTypeEditForm
          savingsContractTypeDetail={savingsContractTypeDetail}
        />
        <Sheet.Content></Sheet.Content>
      </Sheet.View>
    </Sheet>
  );
};

export const ContractTypeDetailSheetHeader = () => {
  return (
    <Sheet.Header className="border-b gap-3">
      <Sheet.Title>Update Contract Type</Sheet.Title>
    </Sheet.Header>
  );
};

export const ContractTypeEditForm = ({ savingsContractTypeDetail }: any) => {
  const { editContractTypeField, loading } = useContractTypeEditField();

  const form = useForm<ContractTypeFormValues>({
    resolver: zodResolver(contractTypeFormSchema),
    defaultValues: {
      ...savingsContractTypeDetail,
      isAllowIncome: savingsContractTypeDetail?.isAllowIncome || false,
      isDeposit: savingsContractTypeDetail?.isDeposit || false,
    },
  });

  const { toast } = useToast();

  async function onSubmit(data: ContractTypeFormValues) {
    editContractTypeField({
      variables: {
        _id: savingsContractTypeDetail._id,
        ...data,
        name: data.name ?? '',
        code: data.code ?? '',
      },
      onError: (e: ApolloError) => {
        toast({
          title: 'Error',
          description: e.message,
        });
      },
    });
  }

  const handleCancel = () => {
    form.reset();
  };

  return (
    <AddContractTypeForm
      form={form}
      loading={loading}
      onSubmit={onSubmit}
      handleCancel={handleCancel}
    />
  );
};
