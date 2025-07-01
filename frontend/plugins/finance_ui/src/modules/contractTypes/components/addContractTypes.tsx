'use client';
import { useForm } from 'react-hook-form';
import { useAddContractType } from '~/modules/contractTypes/hooks/addContractType';
import { ContractTypeFormValues } from '~/modules/contractTypes/components/formSchema';

export function AddContractTypeForm({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const { contractTypesAdd, loading: editLoading } = useAddContractType();
  const form = useForm<ContractTypeFormValues>({});
}
