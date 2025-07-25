'use client';

import { ContractTypeAddSheetHeader } from '@/contractTypes/components/AddContractTypeForm';
import { Button, Form, Sheet, ScrollArea } from 'erxes-ui';
import { ContractTypeGeneralInformationFields } from '@/contractTypes/components/ContractTypeGeneralInformationFields';

export const AddContractTypeForm = ({
  onOpenChange,
  form,
  onSubmit,
  loading,
  handleCancel,
}: {
  form: any;
  onSubmit: any;
  loading: any;
  onOpenChange?: (open: boolean) => void;
  handleCancel?: any;
}) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full overflow-hidden"
      >
        <Sheet.Content className="flex-auto overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-5">
              <ContractTypeGeneralInformationFields form={form} />
            </div>
          </ScrollArea>
        </Sheet.Content>

        <Sheet.Footer className="flex justify-end flex-shrink-0 p-2.5 gap-1 bg-muted">
          <Button
            type="button"
            variant="ghost"
            className="bg-background hover:bg-background/90"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </Sheet.Footer>
      </form>
    </Form>
  );
};
