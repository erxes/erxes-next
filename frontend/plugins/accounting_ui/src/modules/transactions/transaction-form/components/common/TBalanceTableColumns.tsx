import { IconCalendar, IconFile, IconMoneybag } from '@tabler/icons-react';
import { Cell, ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import {
  CurrencyCode,
  CurrencyFormatedDisplay,
  InlineCell,
  InlineCellDisplay,
  InlineCellEdit,
  Input,
  RecordTable,
} from 'erxes-ui';
import { useSetAtom } from 'jotai';
import { useState } from 'react';
import { TR_SIDES } from '@/transactions/types/constants';
import { activeJournalState } from '../../states/trStates';
import { ITBalanceTransaction } from '../../types/TBalance';

// Create named components for cell renderers to fix React Hook usage
const NumberCell = ({ getValue, row }: any) => {
  const [number, setNumber] = useState(getValue() as string);
  const { _id } = row.original;

  return (
    <InlineCell
      name="number"
      recordId={_id || ''}
      display={() => (
        <InlineCellDisplay>{getValue() as string}</InlineCellDisplay>
      )}
      edit={() => (
        <InlineCellEdit>
          <Input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full"
          />
        </InlineCellEdit>
      )}
    />
  );
};

const DescriptionCell = ({ getValue, row }: any) => {
  const [description, setDescription] = useState(getValue() as string);
  const { _id } = row.original;

  return (
    <InlineCell
      name="description"
      recordId={_id || ''}
      display={() => (
        <InlineCellDisplay>{getValue() as string}</InlineCellDisplay>
      )}
      edit={() => (
        <InlineCellEdit className="w-80">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </InlineCellEdit>
      )}
    />
  );
};

const DebitCell = ({ getValue, row }: any) => {
  const { _id, detail } = row.original;
  const { amount, side } = detail;

  return (
    <InlineCell
      name="debit"
      recordId={_id || ''}
      display={() => (
        <InlineCellDisplay>
          <CurrencyFormatedDisplay
            currencyValue={{
              currencyCode: CurrencyCode.MNT,
              amountMicros: side === TR_SIDES.DEBIT ? amount * 1000000 : 0,
            }}
          />
        </InlineCellDisplay>
      )}
    />
  );
};

const CreditCell = ({ getValue, row }: any) => {
  const { _id, detail } = row.original;
  const { amount, side } = detail;

  return (
    <InlineCell
      name="credit"
      recordId={_id || ''}
      display={() => (
        <InlineCellDisplay>
          <CurrencyFormatedDisplay
            currencyValue={{
              currencyCode: CurrencyCode.MNT,
              amountMicros: side === TR_SIDES.CREDIT ? amount * 1000000 : 0,
            }}
          />
        </InlineCellDisplay>
      )}
    />
  );
};

const BranchCell = ({ row }: any) => {
  const { _id, branch } = row.original;

  return (
    <InlineCell
      name="branch"
      recordId={_id || ''}
      display={() => (
        <InlineCellDisplay>
          {`${branch?.code ? `${branch.code} - ` : ''}${branch?.title ?? ''}`}
        </InlineCellDisplay>
      )}
    />
  );
};

const DepartmentCell = ({ row }: any) => {
  const { _id, department } = row.original;

  return (
    <InlineCell
      name="department"
      recordId={_id || ''}
      display={() => (
        <InlineCellDisplay>
          {`${department?.code ? `${department.code} - ` : ''}${department?.title ?? ''}`}
        </InlineCellDisplay>
      )}
    />
  );
};

const DateCell = ({ getValue, row }: any) => {
  const { _id } = row.original;
  return (
    <InlineCell
      name="date"
      recordId={_id || ''}
      display={() => (
        <InlineCellDisplay>
          {dayjs(new Date(getValue())).format("YYYY-MM-DD")}
        </InlineCellDisplay>
      )}
    />
  );
};

const AccountCell = ({ row }: any) => {
  const { details, _id } = row.original;

  return (
    <InlineCell
      name="account"
      recordId={_id || ''}
      display={() => (
        <InlineCellDisplay>
          {details.length &&
            `${details[0].account?.code} - ${details[0].account?.name}`}
        </InlineCellDisplay>
      )}
    />
  );
};

const TransactionMoreColumnCell = ({
  cell,
}: {
  cell: Cell<ITBalanceTransaction, unknown>;
}) => {
  const setActiveJournal = useSetAtom(activeJournalState);
  const { journalIndex } = cell.row.original;

  return (
    <RecordTable.MoreButton
      className="w-full h-full"
      onClick={() => {
        setActiveJournal(journalIndex)
      }}
    />
  );
};

const transactionMoreColumn = {
  id: 'more',
  cell: TransactionMoreColumnCell,
  size: 33,
};

export const tbalanceColumns: ColumnDef<ITBalanceTransaction>[] = [
  transactionMoreColumn,
  {
    id: 'account',
    header: () => (
      <RecordTable.InlineHead icon={IconMoneybag} label="Account" />
    ),
    accessorKey: 'details',
    cell: ({ row }) => <AccountCell row={row} />,
  },
  {
    id: 'number',
    header: () => <RecordTable.InlineHead icon={IconFile} label="Number" />,
    accessorKey: 'number',
    cell: ({ getValue, row }) => <NumberCell getValue={getValue} row={row} />,
  },
  {
    id: 'date',
    header: () => <RecordTable.InlineHead icon={IconCalendar} label="Date" />,
    accessorKey: 'date',
    cell: ({ getValue, row }) => <DateCell getValue={getValue} row={row} />,
  },
  {
    id: 'description',
    header: () => (
      <RecordTable.InlineHead icon={IconFile} label="Description" />
    ),
    accessorKey: 'description',
    cell: ({ getValue, row }) => (
      <DescriptionCell getValue={getValue} row={row} />
    ),
    size: 300,
  },
  {
    id: 'debit',
    header: () => (
      <RecordTable.InlineHead icon={IconMoneybag} label="Debit" />
    ),
    accessorKey: 'debit',
    cell: ({ getValue, row }) => <DebitCell getValue={getValue} row={row} />,
  },
  {
    id: 'credit',
    header: () => (
      <RecordTable.InlineHead icon={IconMoneybag} label="Credit" />
    ),
    accessorKey: 'credit',
    cell: ({ getValue, row }) => <CreditCell getValue={getValue} row={row} />,
  },
  {
    id: 'branch',
    header: () => <RecordTable.InlineHead icon={IconFile} label="Branch" />,
    accessorKey: 'branch',
    cell: ({ getValue, row }) => <BranchCell getValue={getValue} row={row} />,
  },
  {
    id: 'department',
    header: () => <RecordTable.InlineHead icon={IconFile} label="Department" />,
    accessorKey: 'department',
    cell: ({ getValue, row }) => <DepartmentCell getValue={getValue} row={row} />,
  },
];
