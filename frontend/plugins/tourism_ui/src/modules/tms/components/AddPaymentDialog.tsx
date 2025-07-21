import { useState } from 'react';
import { Button, Dialog, Input, Label } from 'erxes-ui';
import { IconPlus, IconX } from '@tabler/icons-react';

export const AddPaymentDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          variant="default"
          className="flex gap-2 items-center h-8"
          type="button"
        >
          <IconPlus size={18} />
          Add Payment
        </Button>
      </Dialog.Trigger>

      <Dialog.Content className="max-w-lg">
        <Dialog.Header>
          <Dialog.Title>Add New Payment Method</Dialog.Title>
          <Dialog.Description>
            Add a new payment method to your available options.
          </Dialog.Description>
          <Dialog.Close asChild>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-3 right-4"
            >
              <IconX />
            </Button>
          </Dialog.Close>
        </Dialog.Header>

        <form className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Payment Name <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g., Visa, Mastercard, QPay"
                className="h-9"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Payment Value <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g., visa, mastercard, qpay"
                className="h-9"
              />
            </div>
          </div>

          <Dialog.Footer>
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="button">Add Payment Method</Button>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog>
  );
};

export default AddPaymentDialog;
