import { useAtom } from 'jotai';
import { atom } from 'jotai';
import { Sheet, Spinner, toast } from 'erxes-ui';
import { useContractTypeDetail } from '@/contractTypes/hooks/useContractTypeDetail';
import { useForm } from 'react-hook-form';
import { contractTypeFormSchema } from '@/contractTypes/components/formSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { z } from 'zod';
import { useContractTypeEdit } from '@/contractTypes/hooks/useContractTypeEdit';
import { useIntegrationDetail } from '@/contractTypes/hooks/useContractDetail';
import { AddContractTypeForm } from '@/contractTypes/components/AddContractType';

export const contractTypeEditSheetAtom = atom<string | null>(null);

export const ContractTypeSheetEdit = () => {
  const [contractTypeEditSheet, setContractTypeEditSheet] = useAtom(
    contractTypeEditSheetAtom,
  );
  return (
    <Sheet
      open={!!contractTypeEditSheet}
      onOpenChange={() => setContractTypeEditSheet(null)}
    >
      <Sheet.View className="sm:max-w-3xl">
        <ContractTypeEdit />
      </Sheet.View>
    </Sheet>
  );
};

export const ContractTypeEdit = () => {
  const [typeId, setEditSheet] = useAtom(contractTypeEditSheetAtom);
  const { contractTypeDetail, loading } = useIntegrationDetail({
    typeId,
  });

  const { savingsContractTypeDetail, loading: callLoading } =
    useContractTypeDetail(typeId);

  const { editContractType, loading: editLoading } = useContractTypeEdit();

  const form = useForm<z.infer<typeof contractTypeFormSchema>>({
    resolver: zodResolver(contractTypeFormSchema),
  });

  const onSubmit = (data: z.infer<typeof contractTypeFormSchema>) => {
    editContractType({
      variables: {
        _id: typeId,
        name: data.name,
        code: data.code,
        number: data.number,
        vacancy: data.vacancy,
        currency: data.currency,
        description: data.description,
        interestCalcType: data.interestCalcType,
        interestRate: data.interestRate,
        closeInterestRate: data.closeInterestRate,
        isAllowIncome: data.isAllowIncome,
        isDeposit: data.isDeposit,
        limitPercentage: data.limitPercentage,
      },
      refetchQueries: ['ContractType', 'ContractTypeDetail'],
      onCompleted() {
        setEditSheet(null);
      },
      onError(e) {
        toast({
          title: 'Something went wrong.',
          description: e.message,
          variant: 'destructive',
        });

        setEditSheet(null);
      },
    });
  };

  useEffect(() => {}, [
    contractTypeDetail,
    savingsContractTypeDetail,
    callLoading,
    loading,
  ]);

  if (loading || callLoading) {
    return <Spinner className="h-full" />;
  }

  return (
    <AddContractTypeForm
      form={form}
      onSubmit={onSubmit}
      loading={editLoading}
      onOpenChange={() => {}}
      handleCancel={() => {}}
    />
  );
};
