import { ApolloError } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  usePreviousHotkeyScope,
  useScopedHotkeys,
  useSetHotkeyScope,
  Kbd,
  Sheet,
  Button,
  useToast,
  useQueryState,
} from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { AddContractTypeForm } from '@/contractTypes/components/AddContractType';
import {
  contractTypeFormSchema,
  ContractTypeFormValues,
} from '@/contractTypes/components/formSchema';
import { useAddContractType } from '@/contractTypes/hooks/useAddContractType';
import { ContractTypeHotKeyScope } from '@/contractTypes/types';
import { useState } from 'react';

export const ContractTypeAddSheet = () => {
  const [open, setOpen] = useState(false);
  const setHotkeyScope = useSetHotkeyScope();

  const { setHotkeyScopeAndMemorizePreviousScope } = usePreviousHotkeyScope();
  const onOpen = () => {
    setHotkeyScopeAndMemorizePreviousScope(
      ContractTypeHotKeyScope.ContractTypeAddSheet,
    );
    setOpen(true);
  };

  const onClose = () => {
    setHotkeyScope(ContractTypeHotKeyScope.ContractTypesPage);
    setOpen(false);
  };

  useScopedHotkeys(
    `esc`,
    () => onClose(),
    ContractTypeHotKeyScope.ContractTypeAddSheet,
  );

  return (
    <Sheet onOpenChange={(open) => (open ? onOpen() : onClose())} open={open}>
      <Sheet.Trigger asChild>
        <Button>
          Add Type
          <Kbd>C</Kbd>
        </Button>
      </Sheet.Trigger>
      <Sheet.View
        className="sm:max-w-lg p-0"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <ContractTypeAddSheetHeader />
        <ContractTypeAddForm />
      </Sheet.View>
    </Sheet>
  );
};

export const ContractTypeAddSheetHeader = () => {
  return (
    <Sheet.Header className="border-b gap-3">
      <Sheet.Title>Create Contract Type</Sheet.Title> <Sheet.Close />
    </Sheet.Header>
  );
};

export const ContractTypeAddForm = ({}: {}) => {
  const { contractTypesAdd, loading } = useAddContractType();

  const form = useForm<ContractTypeFormValues>({
    resolver: zodResolver(contractTypeFormSchema),
  });

  const { toast } = useToast();

  async function onSubmit(data: ContractTypeFormValues) {
    contractTypesAdd({
      variables: {
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

      onCompleted: () => {
        form.reset();
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
