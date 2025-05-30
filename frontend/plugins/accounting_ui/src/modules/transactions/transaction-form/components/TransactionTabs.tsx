import { IconPlus, IconX } from '@tabler/icons-react';

import { useFieldArray } from 'react-hook-form';

import {
  ITransactionGroupForm,
  TTrDoc,
} from '../types/AddTransaction';
import { Tabs, Button } from 'erxes-ui';
import { useAtom } from 'jotai';
import { activeJournalState } from '../states/trStates';
import { AddTransaction } from '../../components/AddTransaction';
import { MainJournalForm } from './forms/MainJournalForm';
import { CashTransaction } from './forms/CashForm';
import { BankTransaction } from './forms/BankForm';
import { JOURNALS_BY_JOURNAL } from '../contants/defaultValues';
import { InvIncomeForm } from './forms/InvIncomeForm';
import { TR_JOURNAL_LABELS, TrJournalEnum } from '../../types/constants';
import { TBalance } from './common/TBalance';
import { ReceivableTransaction } from './forms/ReceivableForm';
import { PayableTransaction } from './forms/PayableForm';


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
  if (field.journal === TrJournalEnum.MAIN)
    return <MainJournalForm form={form} index={index} />;
  if (field.journal === TrJournalEnum.CASH)
    return <CashTransaction form={form} index={index} />;
  if (field.journal === TrJournalEnum.BANK)
    return <BankTransaction form={form} index={index} />;
  if (field.journal === TrJournalEnum.RECEIVABLE)
    return <ReceivableTransaction form={form} index={index} />;
  if (field.journal === TrJournalEnum.PAYABLE)
    return <PayableTransaction form={form} index={index} />;
  if (field.journal === TrJournalEnum.INV_INCOME)
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
    name: 'trDocs',
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

  const handleAddTransaction = (journal?: TrJournalEnum) => {
    const selectedJournal = journal || TrJournalEnum.MAIN;
    const newJournal = JOURNALS_BY_JOURNAL(selectedJournal) as TTrDoc;
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
                {TR_JOURNAL_LABELS[field.journal]}

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
          <Tabs.Trigger
            key={'tBalance'}
            value={'tBalance'}
            className="capitalize py-1 gap-2 pr-1 h-8"
            asChild
          >
            <div>
              {'T Balance'}
            </div>
          </Tabs.Trigger>
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
      <Tabs.Content
        key={'tBalance'}
        value={'tBalance'}
        className="mt-6"
      >
        <TBalance form={form} />
      </Tabs.Content>
    </Tabs>
  );
};
