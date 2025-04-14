import { Button, Dialog } from 'erxes-ui';
import { useState } from 'react';
import { VatFormValues, VatKind, VatStatus } from '../types/Vat';
import { vatFormSchema } from '../constants/vatFormSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VatForm } from './VatForm';
import { IconPlus } from '@tabler/icons-react';
import { useAddVat } from '../hooks/useAddVat';

export const AddVats = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>
          <IconPlus />
          Add Vat
        </Button>
      </Dialog.Trigger>
      <Dialog.ContentCombined
        title="Add Vat"
        description="Add a new vat"
        className="sm:max-w-2xl"
      >
        <AddVatForm />
      </Dialog.ContentCombined>
    </Dialog>
  );
};

export const AddVatForm = () => {
  const form = useForm<VatFormValues>({
    resolver: zodResolver(vatFormSchema),
    defaultValues: {
      status: VatStatus.ACTIVE,
      isBold: false,
      kind: VatKind.NORMAL,
    },
  });
  const { addVat, loading } = useAddVat();

  const onSubmit = (data: VatFormValues) => {
    addVat({ variables: { ...data } });
  };

  return <VatForm form={form} onSubmit={onSubmit} loading={loading} />;
};
