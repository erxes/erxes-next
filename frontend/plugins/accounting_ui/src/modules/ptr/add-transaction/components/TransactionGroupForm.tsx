import { zodResolver } from '@hookform/resolvers/zod';
import { transactionGroupSchema } from '../contants/transactionSchema';
import { useForm } from 'react-hook-form';
import { DatePicker, Form, Input, toast, useQueryState } from 'erxes-ui';
import { useTransactionsCreate } from '../hooks/useTransactionsCreate';
import { TAddTransactionGroup } from '../types/AddTransaction';
import { TransactionsTabsList } from './TransactionList';
import { Summary } from './Summary';
import { useCallback, useEffect, memo } from 'react';
import { JOURNALS_BY_JOURNAL } from '../contants/defaultValues';
import { JournalEnum } from '@/settings/account/types/Account';
import { activeJournalState } from '../states/addTrStates';
import { useSetAtom } from 'jotai';

// Memoize form fields to prevent unnecessary re-renders
const FormFields = memo(
  ({ form }: { form: ReturnType<typeof useForm<TAddTransactionGroup>> }) => (
    <div className="grid grid-cols-2 xl:grid-cols-5 gap-6 py-6 items-end">
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
      <Summary form={form} />
    </div>
  ),
);

FormFields.displayName = 'FormFields';

export const TransactionGroupForm = () => {
  const form = useForm<TAddTransactionGroup>({
    resolver: zodResolver(transactionGroupSchema),
    defaultValues: {
      date: new Date(),
    },
  });
  const [defaultJournal] = useQueryState<JournalEnum>('defaultJournal');
  const setActiveJournal = useSetAtom(activeJournalState);

  const { createTransaction } = useTransactionsCreate();

  const onSubmit = useCallback((data: TAddTransactionGroup) => {
    createTransaction(data);
    console.log(data);
  }, []);

  const onError = useCallback((error: any) => {
    if (error?.details?.length > 0) {
      setActiveJournal(error.details.findIndex((tab: any) => !!tab).toString());
    }
    console.log(error);
  }, []);

  useEffect(() => {
    if (defaultJournal) {
      form.reset({
        ...form.getValues(),
        details: [JOURNALS_BY_JOURNAL[defaultJournal]],
      });
    }
  }, [defaultJournal, form]);

  return (
    <Form {...form}>
      <form
        className="px-6 flex-auto overflow-auto"
        onSubmit={form.handleSubmit(onSubmit, onError)}
      >
        <h3 className="text-lg font-bold">Create Transaction</h3>
        <FormFields form={form} />
        <TransactionsTabsList form={form} />
      </form>
    </Form>
  );
};
