import { Button, Dialog } from 'erxes-ui';
import { useState } from 'react';
import { CtaxFormValues } from '../types/CTax';
import { ctaxFormSchema } from '../constants/ctaxFormSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CtaxForm } from './CTaxForm';
import { IconPlus } from '@tabler/icons-react';

export const AddCTax = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>
          <IconPlus />
          Add CTax
        </Button>
      </Dialog.Trigger>
      <Dialog.ContentCombined
        title="Add CTax"
        description="Add a new ctax"
        className="sm:max-w-2xl"
      >
        <AddCTaxForm />
      </Dialog.ContentCombined>
    </Dialog>
  );
};

export const AddCTaxForm = () => {
  const form = useForm<CtaxFormValues>({
    resolver: zodResolver(ctaxFormSchema),
  });

  const onSubmit = (data: CtaxFormValues) => {
    console.log(data);
  };

  return <CtaxForm form={form} onSubmit={onSubmit} loading={false} />;
};
