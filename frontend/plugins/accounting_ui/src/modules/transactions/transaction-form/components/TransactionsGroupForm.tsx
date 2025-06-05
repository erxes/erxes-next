import { useMainConfigs } from '@/settings/hooks/useMainConfigs';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker, Form, Input, Spinner, useQueryState } from 'erxes-ui';
import { useSetAtom } from 'jotai';
import { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TrJournalEnum } from '../../types/constants';
import { JOURNALS_BY_JOURNAL } from '../contants/defaultValues';
import { transactionGroupSchema } from '../contants/transactionSchema';
import { useTransactionDetail } from '../hooks/useTransactionDetail';
import { useTransactionsCreate } from '../hooks/useTransactionsCreate';
import { useTransactionsUpdate } from '../hooks/useTransactionsUpdate';
import { activeJournalState } from '../states/trStates';
import { TAddTransactionGroup } from '../types/JournalForms';
import { Summary } from './common/Summary';
import { TransactionsTabsList } from './TransactionTabs';

// Memoize form fields to prevent unnecessary re-renders
const FormFields = memo(
  ({ form }: { form: ReturnType<typeof useForm<TAddTransactionGroup>> }) => {
    return (
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
    )
  }
);

FormFields.displayName = 'FormFields';

export const TransactionsGroupForm = () => {
  // const parentId = useParams().parentId;
  const [parentId] = useQueryState<string>('parentId');
  const { activeTrs, loading } = useTransactionDetail({
    variables: { _id: parentId },
    skip: !parentId,
  });

  const { loading: configsLoading } = useMainConfigs();
  const form = useForm<TAddTransactionGroup>({
    resolver: zodResolver(transactionGroupSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  const [defaultJournal] = useQueryState<TrJournalEnum>('defaultJournal');
  const [trId] = useQueryState<string>('trId');

  const setActiveJournal = useSetAtom(activeJournalState);

  const { createTransaction } = useTransactionsCreate();
  const { updateTransaction } = useTransactionsUpdate();

  const onSubmit = (data: TAddTransactionGroup) => {
    // transactionGroup get
    if (parentId) {
      updateTransaction(data);
    } else {
      createTransaction(data);
    }
  };

  const onError = (error: any) => {
    if (error?.details?.length > 0) {
      setActiveJournal(error.details.findIndex((tab: any) => !!tab).toString());
    }
    console.log(error);
  };

  useEffect(() => {
    if (activeTrs?.length && parentId) {
      const currentTr = trId ? activeTrs.find(tr => tr._id === trId) : activeTrs[0];
      // setting form values
      form.reset({
        ...form.getValues(),
        parentId,
        number: currentTr?.number || 'auto',
        date: new Date(currentTr?.date || new Date()),
        trDocs: activeTrs.map(atr => (JOURNALS_BY_JOURNAL(atr?.journal || '', atr)))
      });
    }
    if (defaultJournal) {
      form.reset({
        ...form.getValues(),
        trDocs: [JOURNALS_BY_JOURNAL(defaultJournal)],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultJournal, trId, form, loading]);

  if (configsLoading || loading) {
    return <Spinner />
  }

  return (
    <Form {...form}>
      <form
        className="px-6 flex-auto overflow-auto"
        onSubmit={form.handleSubmit(onSubmit, onError)}
      >
        <h3 className="text-lg font-bold">{parentId ? `Edit` : `Create`} Transaction</h3>
        <FormFields form={form} />
        <TransactionsTabsList form={form} />
      </form>
    </Form>
  );
};
