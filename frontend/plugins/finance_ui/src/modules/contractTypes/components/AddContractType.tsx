'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  contractTypeFormSchema,
  ContractTypeFormValues,
} from '~/modules/contractTypes/components/formSchema';
import { useAddContractType } from '~/modules/contractTypes/hooks/addContractType';
import { useToast } from 'erxes-ui/hooks';
import { ApolloError } from '@apollo/client';
import { ContractTypeAddSheetHeader } from '~/modules/contractTypes/components/AddContractTypeForm';
import { Button, Form, Sheet, ScrollArea } from 'erxes-ui';
import { ContractTypeGeneralInformationFields } from '~/modules/contractTypes/components/ContractTypeGeneralInformationFields';

export const AddContractTypeForm = ({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) => {
  const { contractTypesAdd, loading: editLoading } = useAddContractType();

  const form = useForm<ContractTypeFormValues>({
    resolver: zodResolver(contractTypeFormSchema),
  });

  const { toast } = useToast();

  async function onSubmit(data: ContractTypeFormValues) {
    const cleanData: Record<string, any> = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        cleanData[key] = value;
      }
    });

    contractTypesAdd({
      variables: {
        ...cleanData,
        name: cleanData.name ?? '',
        code: cleanData.code ?? '',
      },
      onError: (e: ApolloError) => {
        toast({
          title: 'Error',
          description: e.message,
        });
      },

      onCompleted: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  }

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full overflow-hidden"
      >
        <ContractTypeAddSheetHeader />
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
            disabled={editLoading}
          >
            {editLoading ? 'Saving...' : 'Save'}
          </Button>
        </Sheet.Footer>
      </form>
    </Form>
  );
};
