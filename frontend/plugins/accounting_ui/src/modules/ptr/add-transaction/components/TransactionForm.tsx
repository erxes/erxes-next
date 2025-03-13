import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema } from '../contants/transactionSchema';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import {
  Button,
  CurrencyCode,
  CurrencyInput,
  DatePicker,
  Form,
  Input,
  Select,
  Separator,
  Tabs,
  useQueryState,
} from 'erxes-ui';
import { AddTransaction } from '../../components/AddTransaction';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { AssignMember } from 'ui-modules';
import { SelectAccount } from '@/account/components/SelectAccount';
import { useTransactionsCreate } from '../hooks/useTransactionsCreate';

export const TransactionForm = () => {
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
  });
  const { createTransaction, loading } = useTransactionsCreate();
  console.log(form.formState.errors);
  const handleSubmit = (data: z.infer<typeof transactionSchema>) => {
    console.log(data);
    createTransaction({
      variables: {
        trDocs: [
          {
            _id: 'temp0.5636135791451535',
            number: 'auto/new',
            date: '2025-03-12T17:08:10.930Z',
            description: 'TEST',
            journal: 'bank',
            branchId: 'MkFeQext2BwsrvCZA',
            departmentId: 'nmoDHQS2hnBmcpfDD',
            customerType: 'company',
            customerId: '9DDJXW59AYglt9mCXOqv-',
            assignedUserIds: ['a9E79lAG2AgtG7pdN38ov'],
            details: [
              {
                accountId: '3PoSSHOWHiD5UHlGh8FJ8',
                side: 'dt',
                amount: 10000,
              },
            ],
          },
          {
            _id: 'temp0.09476074716209149',
            number: 'auto/new',
            date: '2025-03-12T17:08:10.930Z',
            description: 'tt',
            journal: 'cash',
            branchId: 'MkFeQext2BwsrvCZA',
            departmentId: 'TpvMvQW8J9scAJNJ4',
            customerType: 'company',
            customerId: 'ifNQpBDnA7kR8yYssDFHe',
            assignedUserIds: ['TtsdAJ2Htx-HKqLug-Z5b'],
            details: [
              {
                accountId: 'Vt-oZ_78Ku6ojkCpKfvAt',
                side: 'dt',
                amount: 20000,
              },
            ],
          },
        ],
      },
    });
  };
  return (
    <Form {...form}>
      <div className="grid grid-cols-3 gap-6">
        <form
          className="grid grid-cols-2 max-w-4xl w-full mx-auto gap-6 p-6 col-span-2"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <h3 className="text-lg font-bold col-span-2">Create Transaction</h3>
          <Form.Field
            control={form.control}
            name="number"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Number</Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
              </Form.Item>
            )}
          />
          <Form.Field
            control={form.control}
            name="date"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Date</Form.Label>
                <Form.Control>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    className="h-8 flex w-full"
                  />
                </Form.Control>
              </Form.Item>
            )}
          />

          <TransactionsTabsList>
            <Tabs.Content value="cash" className="py-4">
              <CashTransactions form={form} />
            </Tabs.Content>
            <Tabs.Content value="bank" className="py-4">
              <BankTransactions />
            </Tabs.Content>
          </TransactionsTabsList>
          <Button type="submit" className="col-span-2">
            Create
          </Button>
        </form>
        <div className="col-span-1">
          <div className="p-6">
            <h3 className="text-lg font-bold">Transaction Balance</h3>
          </div>
        </div>
      </div>
    </Form>
  );
};

const CashTransactions = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof transactionSchema>>;
}) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Form.Field
        control={form.control}
        name="cash.accountId"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Cash Account</Form.Label>
            <Form.Control>
              <SelectAccount
                value={field.value}
                onChange={field.onChange}
                journal="cash"
              />
            </Form.Control>
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="cash.side"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Side</Form.Label>
            <Select value={field.value} onValueChange={field.onChange}>
              <Form.Control>
                <Select.Trigger className="h-8">
                  <Select.Value />
                </Select.Trigger>
              </Form.Control>
              <Select.Content>
                <Select.Item value="incoming">Incoming</Select.Item>
                <Select.Item value="outgoing">Outgoing</Select.Item>
              </Select.Content>
            </Select>
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="cash.amount"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Amount</Form.Label>
            <Form.Control>
              <CurrencyInput
                value={field.value}
                onChange={field.onChange}
                currencyCode={CurrencyCode.MNT}
              />
            </Form.Control>
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="cash.assignedTo"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Assign To</Form.Label>
            <Form.Control>
              <AssignMember
                onValueChange={(user) => field.onChange(user)}
                value={field.value}
                className="w-full flex h-8"
                size="lg"
              />
            </Form.Control>
          </Form.Item>
        )}
      />

      <Form.Field
        control={form.control}
        name="cash.customerType"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Customer Type</Form.Label>
            <Form.Control>
              <Select value={field.value} onValueChange={field.onChange}>
                <Form.Control>
                  <Select.Trigger className="h-8">
                    <Select.Value />
                  </Select.Trigger>
                </Form.Control>
                <Select.Content>
                  <Select.Item value="customer">Customer</Select.Item>
                  <Select.Item value="company">Company</Select.Item>
                  <Select.Item value="user">Team member</Select.Item>
                </Select.Content>
              </Select>
            </Form.Control>
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="cash.customerId"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Customer</Form.Label>
            <Form.Control>
              <AssignMember
                onValueChange={(user) => field.onChange(user)}
                value={field.value}
                className="w-full flex h-8"
                size="lg"
              />
            </Form.Control>
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="cash.description"
        render={({ field }) => (
          <Form.Item className="col-span-2">
            <Form.Label>Description</Form.Label>
            <Form.Control>
              <Input {...field} />
            </Form.Control>
          </Form.Item>
        )}
      />
    </div>
  );
};

const BankTransactions = () => {
  return <div>Bank</div>;
};

const TransactionsTabsList = ({ children }: { children: React.ReactNode }) => {
  const [defaultJournal] = useQueryState<string | undefined>('defaultJournal');
  const [activeJournal, setActiveJournal] = useState(defaultJournal || 'cash');

  return (
    <Tabs
      className="col-span-2"
      value={activeJournal}
      onValueChange={setActiveJournal}
    >
      <Tabs.List className="w-full justify-start" defaultValue="cash">
        <Tabs.Trigger value="cash">Cash</Tabs.Trigger>
        <Tabs.Trigger value="bank">Bank</Tabs.Trigger>
        <Separator.Inline className="mx-2" />
        <AddTransactionButton />
      </Tabs.List>
      {children}
    </Tabs>
  );
};

const AddTransactionButton = () => {
  const handleAddTransaction = (journal?: string) => {
    console.log(journal);
  };
  return (
    <AddTransaction inForm onClick={handleAddTransaction}>
      <Button variant="ghost" className="text-muted-foreground">
        <IconPlus />
        New Transaction
      </Button>
    </AddTransaction>
  );
};
