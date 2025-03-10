import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  Button,
  ScrollArea,
  Separator,
  Sheet,
  Tabs,
} from 'erxes-ui/components';
import { Form } from 'erxes-ui/components/form';

import { CustomerAddGeneralInformationFields } from '@/contacts/add-contacts/components/CustomerAddGeneralInformationFields';
import { CustomerAddLinksFields } from '@/contacts/add-contacts/components/CustomerAddLinksFields';
import {
  CustomerAddSheet,
  CustomerAddSheetHeader,
} from '@/contacts/add-contacts/components/CustomerAddSheet';
import {
  customerFormSchema,
  CustomerFormType,
} from '@/contacts/add-contacts/components/formSchema';
import { useAddCustomer } from '@/contacts/hooks/useAddCustomer';
import { useToast } from 'erxes-ui/hooks';
import { ApolloError } from '@apollo/client';

export function AddCustomerForm() {
  const [open, setOpen] = useState<boolean>(false);
  const { customersAdd } = useAddCustomer();
  const form = useForm<CustomerFormType>({
    resolver: zodResolver(customerFormSchema),
  });
  const { toast } = useToast();
  const onSubmit = (data: CustomerFormType) => {
    customersAdd({
      variables: data,
      onError: (e: ApolloError) => {
        toast({
          title: 'Error',
          description: e.message,
        });
      },
      onCompleted: () => {
        form.reset();
        setOpen(false);
      },
    });
  };

  return (
    <CustomerAddSheet onOpenChange={setOpen} open={open}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <CustomerAddSheetHeader />
          <Separator />
          <ScrollArea className="flex-auto">
            <Tabs defaultValue="general-information">
              <Tabs.List className="grid grid-cols-2 mb-10">
                <Tabs.Trigger value="general-information" className="h-10">
                  General Information
                </Tabs.Trigger>
                <Tabs.Trigger value="links" className="h-10">
                  Links
                </Tabs.Trigger>
              </Tabs.List>
              <div className="px-5">
                <Tabs.Content value="general-information">
                  <CustomerAddGeneralInformationFields form={form} />
                </Tabs.Content>
                <Tabs.Content value="links">
                  <CustomerAddLinksFields />
                </Tabs.Content>
              </div>
            </Tabs>
          </ScrollArea>
          <Sheet.Footer className="flex justify-end flex-shrink-0 p-2.5 gap-1 bg-muted">
            <Button
              type="button"
              variant="ghost"
              className="bg-background hover:bg-background/90"
              onClick={() => setOpen(false)}
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
    </CustomerAddSheet>
  );
}
