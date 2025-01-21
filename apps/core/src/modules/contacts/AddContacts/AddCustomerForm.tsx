import {
  CustomerAddSheet,
  CustomerAddSheetHeader,
} from '@/contacts/AddContacts/components/CustomerAddSheet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  customerFormSchema,
  CustomerFormType,
} from '@/contacts/AddContacts/components/formSchema';
import {
  Button,
  Sheet,
  ScrollArea,
  Tabs,
  Separator,
} from 'erxes-ui/components';
import { Form } from 'erxes-ui/components/form';
import { useAddCustomer } from '@/contacts/hooks/useAddCustomer';
import { useState } from 'react';
import { CustomerAddGeneralInformationFields } from '@/contacts/AddContacts/components/CustomerAddGeneralInformationFields';
import { CustomerAddLinksFields } from '@/contacts/AddContacts/components/CustomerAddLinksFields';

export function AddCustomerForm() {
  const [open, setOpen] = useState<boolean>(false);
  const { addCustomer } = useAddCustomer();
  const form = useForm<CustomerFormType>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {}
  });
  const onSubmit = async (data: CustomerFormType) => {
    try {
      await addCustomer(data);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <CustomerAddSheet onOpenChange={setOpen} open={open}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <CustomerAddSheetHeader />
          <Separator />
          <ScrollArea.Root className="flex-auto">
            <div className="px-5">
              <Tabs defaultValue="general-information">
                <Tabs.List className="grid grid-cols-2 mb-10 ">
                  <Tabs.Trigger
                    value="general-information"
                    className="text-sm h-12 data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b rounded-none "
                  >
                    General Information
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="links"
                    className="text-sm h-12 data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b rounded-none "
                  >
                    Links
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="general-information">
                  <CustomerAddGeneralInformationFields form={form} />
                </Tabs.Content>
                <Tabs.Content value="links">
                  <CustomerAddLinksFields />
                </Tabs.Content>
              </Tabs>
            </div>
          </ScrollArea.Root>
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
