import { zodResolver } from '@hookform/resolvers/zod';
import { transactionGroupSchema } from '../contants/transactionSchema';
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
  Tabs,
  Textarea,
  useQueryState,
} from 'erxes-ui';
import { AddTransaction } from '../../components/AddTransaction';
import { IconPlus } from '@tabler/icons-react';
import { useEffect } from 'react';
import { AssignMember, SelectBranch } from 'ui-modules';
import { SelectAccount } from '@/account/components/SelectAccount';
import { useTransactionsCreate } from '../hooks/useTransactionsCreate';
import { activeJournalState } from '../states/addTrStates';
import { useAtom } from 'jotai';
import { MainJournalForm } from './MainJournalForm';
import { TAddTransactionGroup } from '../types/AddTransaction';

export const TransactionForm = () => {
  const form = useForm<TAddTransactionGroup>({
    resolver: zodResolver(transactionGroupSchema),
  });
  const { createTransaction } = useTransactionsCreate();
  const handleSubmit = (data: TAddTransactionGroup) => {
    createTransaction({
      variables: {
        ...data,
      },
    });
  };
  return (
    <Form {...form}>
      <form className="px-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <h3 className="text-lg font-bold">Create Transaction</h3>
        <div className="grid grid-cols-5 gap-6 py-6 items-end">
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
          <div className="flex justify-end items-center col-span-3 gap-6">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-accent-foreground">Sum Debit:</span>
              <span className="text-primary font-bold">100,000</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-accent-foreground">Sum Credit:</span>
              <span className="text-primary font-bold">100,000</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-accent-foreground">+CT:</span>
              <span className="text-primary font-bold">100,000</span>
            </div>
            <Button type="submit">Save</Button>
          </div>
        </div>
        <TransactionsTabsList>
          <Tabs.Content value="cash" className="py-4">
            <CashTransactions form={form} />
          </Tabs.Content>
          <Tabs.Content value="bank" className="py-4">
            <BankTransactions />
          </Tabs.Content>
          <Tabs.Content value="main" className="py-4">
            <MainJournalForm form={form} index={0} />
          </Tabs.Content>
        </TransactionsTabsList>
      </form>
    </Form>
  );
};

const CashTransactions = ({
  form,
}: {
  form: UseFormReturn<TAddTransactionGroup>;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
      <Form.Field
        control={form.control}
        name="details.0.accountId"
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
        name="details.0.side"
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
        name="details.0.amount"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Amount</Form.Label>
            <Form.Control>
              <CurrencyInput
                value={field.value}
                onChange={field.onChange}
                currencyCode={CurrencyCode.MNT}
                displayCurrency="code"
              />
            </Form.Control>
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="details.0.assignedTo"
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
        name="details.0.customerType"
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
        name="details.0.customerId"
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
        name="details.0.branchId"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Branch</Form.Label>
            <Form.Control>
              <SelectBranch
                value={field.value}
                onValueChange={(branch) => field.onChange(branch)}
              />
            </Form.Control>
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="details.0.description"
        render={({ field }) => (
          <Form.Item className="col-span-2">
            <Form.Label>Description</Form.Label>
            <Form.Control>
              <Textarea {...field} />
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
  const [activeJournal, setActiveJournal] = useAtom(activeJournalState);

  useEffect(() => {
    if (defaultJournal) {
      setActiveJournal(defaultJournal);
    }
  }, [defaultJournal, setActiveJournal]);

  return (
    <Tabs
      className="col-span-2"
      value={activeJournal}
      onValueChange={setActiveJournal}
    >
      <div className="flex items-center gap-3">
        <Tabs.List
          className="w-full justify-start flex-auto"
          defaultValue="cash"
        >
          <Tabs.Trigger value="cash">Cash</Tabs.Trigger>
          <Tabs.Trigger value="bank">Bank</Tabs.Trigger>
          <Tabs.Trigger value="main">Main</Tabs.Trigger>
        </Tabs.List>
        <Button variant="secondary">Save transaction template</Button>
        <AddTransactionButton />
      </div>
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
      <Button variant="outline">
        <IconPlus />
        New Transaction
      </Button>
    </AddTransaction>
  );
};
