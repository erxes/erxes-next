import { zodResolver } from '@hookform/resolvers/zod';
import { transactionGroupSchema } from '../contants/transactionSchema';
import { useForm } from 'react-hook-form';
import { DatePicker, Form, Input, useQueryState } from 'erxes-ui';
import { useTransactionsCreate } from '../hooks/useTransactionsCreate';
import { TAddTransactionGroup } from '../types/AddTransaction';
import { TransactionsTabsList } from './TransactionList';
import { Summary } from './Summary';
import { useEffect } from 'react';
import { MAIN_JOURNAL_DEFAULT_VALUES } from '../contants/defaultValues';

export const TransactionGroupForm = () => {
  const form = useForm<TAddTransactionGroup>({
    resolver: zodResolver(transactionGroupSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  const [defaultJournal] = useQueryState<string>('defaultJournal');

  const { createTransaction } = useTransactionsCreate();

  const onSubmit = (data: TAddTransactionGroup) => {
    console.log(data);
    // createTransaction({
    //   variables: {
    //     ...data,
    //   },
    // });
  };

  const onError = (error: any) => {
    console.log(error);
  };

  useEffect(() => {
    if (defaultJournal) {
      form.reset({
        ...form.getValues(),
        details: [MAIN_JOURNAL_DEFAULT_VALUES],
      });
    }
  }, [defaultJournal, form]);

  return (
    <Form {...form}>
      <form className="px-6" onSubmit={form.handleSubmit(onSubmit, onError)}>
        <h3 className="text-lg font-bold">Create Transaction</h3>
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
        <TransactionsTabsList form={form} />
      </form>
    </Form>
  );
};
