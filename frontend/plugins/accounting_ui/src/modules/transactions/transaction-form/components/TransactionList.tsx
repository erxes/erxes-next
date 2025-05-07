import { IconPlus, IconX } from '@tabler/icons-react';

import { useFieldArray } from 'react-hook-form';

import {
  ITransactionGroupForm,
  TAddTransactionGroup,
} from '../types/AddTransaction';
import { Tabs, Button } from 'erxes-ui';
import { useAtom } from 'jotai';
import { activeJournalState } from '../states/trStates';
import { AddTransaction } from '../../components/AddTransaction';
import { CashTransaction } from './CashForm';
import { MainJournalForm } from './MainJournalForm';
import { BankTransaction } from './BankForm';
import { JOURNALS_BY_JOURNAL } from '../contants/defaultValues';
import { JOURNAL_LABELS } from '@/settings/account/constants/journalLabel';
import { InvIncomeForm } from './InvIncomeForm';
import { JournalEnum } from '@/settings/account/types/Account';

// Separate the transaction form component to prevent unnecessary re-renders
const TransactionForm = ({
  form,
  field,
  index,
}: {
  form: ITransactionGroupForm;
  field: any;
  index: number;
}) => {
  if (field.journal === JournalEnum.CASH)
    return <CashTransaction form={form} index={index} />;
  if (field.journal === JournalEnum.BANK)
    return <BankTransaction form={form} index={index} />;
  if (field.journal === JournalEnum.MAIN)
    return <MainJournalForm form={form} index={index} />;
  if (field.journal === JournalEnum.INV_INCOME)
    return <InvIncomeForm form={form} index={index} />;
  return null;
};

export const TransactionsTabsList = ({
  form,
}: {
  form: ITransactionGroupForm;
}) => {
  const [activeJournal, setActiveJournal] = useAtom(activeJournalState);

  // Use useFieldArray with keyName for better performance
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'details',
    keyName: 'fieldId',
    rules: {
      minLength: 1,
    },
  });

  const handleRemove = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    remove(index);
    index.toString() === activeJournal && setActiveJournal('0');
  };

  const handleAddTransaction = (journal?: JournalEnum) => {
    const selectedJournal = journal || JournalEnum.MAIN;
    const newJournal = JOURNALS_BY_JOURNAL[
      selectedJournal
    ] as TAddTransactionGroup['details'][0];
    append(newJournal);
    setActiveJournal(fields.length.toString());
  };

  return (
    <Tabs
      className="col-span-2"
      value={activeJournal}
      onValueChange={setActiveJournal}
    >
      <div className="flex items-center gap-3">
        <Tabs.List className="w-full justify-start flex-auto">
          {fields.map((field, index) => (
            <Tabs.Trigger
              key={field.fieldId}
              value={index.toString()}
              className="capitalize py-1 gap-2 pr-1 h-8"
              asChild
            >
              <div>
                {JOURNAL_LABELS[field.journal]}

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => handleRemove(index, e)}
                  disabled={fields.length === 1}
                >
                  <IconX />
                </Button>
              </div>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Button variant="secondary">Save transaction template</Button>
        <AddTransaction inForm onClick={handleAddTransaction}>
          <Button variant="outline">
            <IconPlus />
            New Transaction
          </Button>
        </AddTransaction>
      </div>
      {fields.map((field, index) => (
        <Tabs.Content
          key={field.fieldId}
          value={index.toString()}
          className="mt-6"
        >
          <TransactionForm form={form} field={field} index={index} />
        </Tabs.Content>
      ))}
    </Tabs>
  );
};
