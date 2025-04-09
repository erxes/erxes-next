import { IconPlus, IconX } from '@tabler/icons-react';

import { useFieldArray, UseFieldArrayAppend } from 'react-hook-form';

import {
  JournalType,
  ITransactionGroupForm,
  TAddTransactionGroup,
} from '../types/AddTransaction';
import { useQueryState, Tabs, Button } from 'erxes-ui';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { activeJournalState } from '../states/addTrStates';
import { AddTransaction } from '../../components/AddTransaction';
import { CashTransaction } from './CashForm';
import { MainJournalForm } from './MainJournalForm';
import { BankTransaction } from './BankForm';
import { JOURNALS_BY_JOURNAL } from '../contants/defaultValues';
import { JOURNAL_LABELS } from '../contants/journalLabel';
import { InvIncomeForm } from './InvIncomeForm';

export const TransactionsTabsList = ({
  form,
}: {
  form: ITransactionGroupForm;
}) => {
  const [defaultJournal] = useQueryState<string | undefined>('defaultJournal');
  const [activeJournal, setActiveJournal] = useAtom(activeJournalState);
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'details',
  });

  useEffect(() => {
    if (defaultJournal) {
      setActiveJournal(
        fields.find((field) => field.journal === defaultJournal)?.id || '',
      );
    }
  }, [defaultJournal, fields, setActiveJournal]);

  useEffect(() => {
    if (fields.length) {
      setActiveJournal((fields.length - 1).toString());
    }
  }, [fields, setActiveJournal]);

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
          {fields.map((field, index) => (
            <Tabs.Trigger
              key={field.id}
              value={`${index}`}
              className="capitalize py-1 gap-2 pr-1"
            >
              {JOURNAL_LABELS[field.journal]}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(index);
                }}
                asChild
              >
                <div>
                  <IconX />
                </div>
              </Button>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Button variant="secondary">Save transaction template</Button>
        <AddTransactionButton append={append} />
      </div>
      {fields.map((field, index) => (
        <Tabs.Content key={field.id} value={`${index}`} className="mt-6">
          {field.journal === 'cash' && (
            <CashTransaction form={form} index={index} />
          )}
          {field.journal === 'bank' && (
            <BankTransaction form={form} index={index} />
          )}
          {field.journal === 'main' && (
            <MainJournalForm form={form} index={index} />
          )}
          {field.journal === 'invincome' && (
            <InvIncomeForm form={form} index={index} />
          )}
        </Tabs.Content>
      ))}
    </Tabs>
  );
};

const AddTransactionButton = ({
  append,
}: {
  append: UseFieldArrayAppend<TAddTransactionGroup>;
}) => {
  const handleAddTransaction = (journal?: JournalType) => {
    append(JOURNALS_BY_JOURNAL[journal || JournalType.MAIN] as any);
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
