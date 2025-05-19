import { RecordTable } from 'erxes-ui';
import { useAtomValue } from 'jotai';
import { useWatch } from 'react-hook-form';
import { AccountingTableRow } from '../../components/AccountingTableRow';
import { transactionColumns } from '../../components/TransactionsTableColumns';
import { ITransaction } from '../../types/Transaction';
import { followTrDocsState } from '../states/trStates';
import { ITransactionGroupForm } from '../types/AddTransaction';

export const TBalance = (
  { form }: {
    form: ITransactionGroupForm;
  }
) => {
  const followTrDocs = useAtomValue(followTrDocsState);
  const trDocs = useWatch({
    control: form.control,
    name: `trDocs`
  });

  const date = useWatch({
    control: form.control,
    name: 'date'
  });

  const number = useWatch({
    control: form.control,
    name: 'number'
  });

  const data: ITransaction[] = [];
  trDocs.forEach((activeTr) => {
    data.push({ ...activeTr, date, number, sumDt: 0, sumCt: 0 } as ITransaction)
  })

  return (
    <RecordTable.Provider
      columns={transactionColumns}
      data={data || []}
      stickyColumns={[]}
      className='m-3'
    >
      <RecordTable.Scroll>
        <RecordTable>
          <RecordTable.Header />
          <RecordTable.Body>
            <AccountingTableRow />
          </RecordTable.Body>
        </RecordTable>
      </RecordTable.Scroll>
    </RecordTable.Provider>
  );
};
