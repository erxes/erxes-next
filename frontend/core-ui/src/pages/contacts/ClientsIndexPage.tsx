import { ClientsHeader } from '@/contacts/clients/components/ClientsHeader';
import { ContactsHotKeyScope } from '@/contacts/types/ContactsHotKeyScope';
import { zodResolver } from '@hookform/resolvers/zod';
import { Command } from 'cmdk';
import {
  Button,
  Combobox,
  Filter,
  Form,
  PageContainer,
  PageSubHeader,
  Popover,
} from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { SelectMember } from 'ui-modules';
import { z } from 'zod';

const formSchema = z.object({
  members: z.array(z.string()).min(1),
});

export const ClientsIndexPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      members: [],
    },
  });
  const onSubmit = (data: any) => {
    // console.log(data);
  };
  return (
    <PageContainer>
      <ClientsHeader />
      <PageSubHeader>
        <Filter
          id="clients-filter"
          sessionKey={ContactsHotKeyScope.ClientsPage}
        >
          <Filter.Bar>
            <Filter.Popover scope={ContactsHotKeyScope.ClientsPage}>
              <Filter.Trigger />
              <Combobox.Content>
                <Filter.View>
                  <Command>
                    <Filter.CommandInput
                      placeholder="Filter"
                      variant="secondary"
                      className="bg-background"
                    />
                    <Command.List>
                      <SelectMember.FilterItem />
                    </Command.List>
                  </Command>
                </Filter.View>
                <SelectMember.FilterView />
              </Combobox.Content>
            </Filter.Popover>
            <SelectMember.FilterBar />
          </Filter.Bar>
        </Filter>
      </PageSubHeader>
      <Form {...form}>
        <form
          className="p-8 w-[300px] space-y-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h1 className="text-2xl font-bold">Clients</h1>
          <Form.Field
            name="members"
            control={form.control}
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Form</Form.Label>
                <SelectMember.FormItem
                  onValueChange={field.onChange}
                  value={field.value}
                  mode="multiple"
                />
                <Form.Message />
              </Form.Item>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <div></div>
    </PageContainer>
  );
};
