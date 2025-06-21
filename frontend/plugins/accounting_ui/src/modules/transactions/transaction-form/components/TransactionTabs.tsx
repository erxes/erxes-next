import { activeJournalState, followTrDocsState } from '../states/trStates';
import { AddTransaction } from '../../components/AddTransaction';
import { BankTransaction } from './forms/BankForm';
import { Button, cn, Tabs } from 'erxes-ui';
import { CashTransaction } from './forms/CashForm';
import { IconPlus, IconX } from '@tabler/icons-react';
import { InvIncomeForm } from './forms/InvIncomeForm';
import { JOURNALS_BY_JOURNAL } from '../contants/defaultValues';
import { MainJournalForm } from './forms/MainJournalForm';
import { PayableTransaction } from './forms/PayableForm';
import { ReceivableTransaction } from './forms/ReceivableForm';
import { sumDtAndCt } from './Summary';
import { TBalance } from './TBalance';
import { TR_JOURNAL_LABELS, TR_SIDES, TrJournalEnum } from '../../types/constants';
import { useAtom } from 'jotai';
import { useFieldArray } from 'react-hook-form';
import {
  ITransactionGroupForm,
  TTrDoc,
} from '../types/JournalForms';

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

  const [followTrDocs] = useAtom(followTrDocsState);

  const handleRemove = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    remove(index);
    index.toString() === activeJournal && setActiveJournal('0');
  };

  const handleAddTransaction = (journal?: TrJournalEnum) => {
    const selectedJournal = journal || TrJournalEnum.MAIN;

    const [sumDebit, sumCredit] = sumDtAndCt(fields as TTrDoc[], followTrDocs);
    const diff = sumDebit - sumCredit;
    const likeTrDoc = fields[0];

    const fakeTrDoc = {
      ptrId: likeTrDoc.ptrId,
      parentId: likeTrDoc.parentId,
      branchId: likeTrDoc.branchId,
      description: likeTrDoc.description,
      customerType: likeTrDoc.customerType,
      customerId: likeTrDoc.customerId,
      departmentId: likeTrDoc.departmentId,
      journal: selectedJournal,
      details: [{
        ...fields[0].details,
        side: diff > 0 ? TR_SIDES.CREDIT : TR_SIDES.DEBIT,
        amount: Math.abs(diff)
      }]
    };

    const newJournal = JOURNALS_BY_JOURNAL(selectedJournal, fakeTrDoc as any) as TTrDoc;
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
              className={cn(index.toString() === activeJournal && "font-bold", "capitalize py-1 gap-2 pr-1 h-8")}
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
            className={cn('tBalance' === activeJournal && "font-bold", "capitalize py-1 gap-2 pr-1 h-8")}
            asChild
          >
            <div>
              {'T Balance'}
            </div>
          </Tabs.Trigger>
          <AddTransaction inForm onClick={handleAddTransaction}>
          <Button variant="ghost">
            <IconPlus />
            New Transaction
          </Button>
        </AddTransaction>
        </Tabs.List>
        
        <Button variant="secondary">Save transaction template</Button>
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
