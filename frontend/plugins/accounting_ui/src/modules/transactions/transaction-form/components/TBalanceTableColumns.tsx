import dayjs from 'dayjs';
import { activeJournalState } from '../states/trStates';
import { Cell, ColumnDef } from '@tanstack/react-table';
import { IconCalendar, IconFile, IconMoneybag } from '@tabler/icons-react';
import { ITBalanceTransaction } from '../types/TBalance';
import { TR_SIDES } from '@/transactions/types/constants';
import { useSetAtom } from 'jotai';
import { useState } from 'react';
import {
  CurrencyCode,
  CurrencyFormatedDisplay,
  Input,
  RecordTable,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTablePopover,
} from 'erxes-ui';

// Create named components for cell renderers to fix React Hook usage
const NumberCell = ({ getValue, row }: any) => {
  const [number, setNumber] = useState(getValue() as string);
  const { _id } = row.original;

  return (
    <RecordTablePopover scope={`tbalance-${_id}-number`}>
      <RecordTableCellTrigger>{getValue() as string}</RecordTableCellTrigger>
      <RecordTableCellContent>
        <Input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="w-full"
        />
      </RecordTableCellContent>
    </RecordTablePopover>
  );
};

const DescriptionCell = ({ getValue, row }: any) => {
  const [description, setDescription] = useState(getValue() as string);
  const { _id } = row.original;

  return (
    <RecordTablePopover scope={`tbalance-${_id}-description`}>
      <RecordTableCellTrigger>{getValue() as string}</RecordTableCellTrigger>
      <RecordTableCellContent className="w-80">
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full"
        />
      </RecordTableCellContent>
    </RecordTablePopover>
  );
};

const DebitCell = ({ getValue, row }: any) => {
  const { detail } = row.original;
  const { amount, side } = detail;

  return (
    <RecordTableCellDisplay>
      <CurrencyFormatedDisplay
        currencyValue={{
          currencyCode: CurrencyCode.MNT,
          amountMicros: side === TR_SIDES.DEBIT ? amount : 0,
        }}
      />
    </RecordTableCellDisplay>
  );
};

const CreditCell = ({ getValue, row }: any) => {
  const { detail } = row.original;
  const { amount, side } = detail;

  return (
    <RecordTableCellDisplay>
      <CurrencyFormatedDisplay
        currencyValue={{
          currencyCode: CurrencyCode.MNT,
          amountMicros: side === TR_SIDES.CREDIT ? amount : 0,
        }}
      />
    </RecordTableCellDisplay>
  );
};

const BranchCell = ({ row }: any) => {
  const { branch } = row.original;

  return (
    <RecordTableCellDisplay>
      {`${branch?.code ? `${branch.code} - ` : ''}${branch?.title ?? ''}`}
    </RecordTableCellDisplay>
  );
};

const DepartmentCell = ({ row }: any) => {
  const { department } = row.original;

  return (
    <RecordTableCellDisplay>
      {`${department?.code ? `${department.code} - ` : ''}${department?.title ?? ''}`}
    </RecordTableCellDisplay>
  );
};

const DateCell = ({ getValue }: any) => {
  return (
    <RecordTableCellDisplay>
      {dayjs(new Date(getValue())).format("YYYY-MM-DD")}
    </RecordTableCellDisplay>
  );
};

const AccountCell = ({ row }: any) => {
  const { details } = row.original;

  return (
    <RecordTableCellDisplay>
      {details.length &&
        `${details[0].account?.code} - ${details[0].account?.name}`}
    </RecordTableCellDisplay>
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
