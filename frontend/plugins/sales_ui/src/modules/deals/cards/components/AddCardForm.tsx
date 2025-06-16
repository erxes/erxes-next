import { Button, Form, ScrollArea, Sheet, useToast } from 'erxes-ui';
import { SalesFormType, salesFormSchema } from '@/deals/constants/formSchema';

import { ApolloError } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

export function AddCardForm({
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void;
}) {
  const form = useForm<SalesFormType>({
    resolver: zodResolver(salesFormSchema),
  });
  //   const { toast } = useToast();

  const onSubmit = (data: SalesFormType) => {
    // customersAdd({
    //   variables: {
    //     ...data,
    //     state,
    //   },
    //   onError: (e: ApolloError) => {
    //     toast({
    //       title: 'Error',
    //       description: e.message,
    //     });
    //   },
    //   onCompleted: () => {
    //     form.reset();
    //     onOpenChange?.(false);
    //   },
    // });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <Sheet.Header className="p-5">
          <Sheet.Title>Add deal</Sheet.Title>
          <Sheet.Description className="sr-only">
            Add a new deal to your stage.
          </Sheet.Description>
          <Sheet.Close />
        </Sheet.Header>
        <Sheet.Content>
          <SalesFormTabs>hi</SalesFormTabs>
        </Sheet.Content>
        <Sheet.Footer className="flex justify-end flex-shrink-0 px-5 gap-1">
          <Button
            type="button"
            variant="ghost"
            className="bg-background hover:bg-background/90"
            onClick={() => onOpenChange?.(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save
          </Button>
        </Sheet.Footer>
      </form>
    </Form>
  );
}

const SalesFormTabs = ({ children }: { children: React.ReactNode }) => {
  return (
    <ScrollArea className="flex-auto">
      <div className="p-5">{children}</div>
    </ScrollArea>
  );
};
