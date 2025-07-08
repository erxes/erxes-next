import dayjs from 'dayjs';
import { Cell, ColumnDef } from '@tanstack/react-table';
import { IconCalendar, IconFile, IconMoneybag } from '@tabler/icons-react';
import { ITransaction } from '../types/Transaction';
import { Link } from 'react-router-dom';
import { TR_JOURNAL_LABELS, TrJournalEnum } from '../types/constants';
import { useState } from 'react';
import {
  RecordTable,
  Input,
  CurrencyCode,
  CurrencyField,
  CurrencyFormatedDisplay,
  RecordTablePopover,
  RecordTableCellTrigger,
  RecordTableCellContent,
  RecordTableCellDisplay,
} from 'erxes-ui';

// Create named components for cell renderers to fix React Hook usage
const NumberCell = ({ getValue, row }: any) => {
  const [number, setNumber] = useState(getValue() as string);
  const { _id } = row.original;

  return (
    <RecordTablePopover scope={`accounting-${_id}-number`}>
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
    <RecordTablePopover scope={`accounting-${_id}-description`}>
      <RecordTableCellTrigger>{getValue() as string}</RecordTableCellTrigger>
      <RecordTableCellContent>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full"
        />
      </RecordTableCellContent>
    </RecordTablePopover>
  );
};

const JournalCell = ({ getValue }: any) => {
  const journal = getValue() as TrJournalEnum;

  return (
    <RecordTableCellDisplay>
      {TR_JOURNAL_LABELS[journal] || 'Main'}
    </RecordTableCellDisplay>
  );
};

const SumDebitCell = ({ getValue, row }: any) => {
  const [sumDt, setSumDt] = useState(getValue() as number);
  const { _id } = row.original;

  return (
    <RecordTablePopover scope={`accounting-${_id}-sumDt`}>
      <RecordTableCellTrigger>
        <CurrencyFormatedDisplay
          currencyValue={{
            currencyCode: CurrencyCode.MNT,
            amountMicros: sumDt * 1000000,
          }}
        />
      </RecordTableCellTrigger>
      <RecordTableCellContent>
        <CurrencyField.ValueInput
          value={sumDt}
          onChange={(value) => setSumDt(value)}
        />
      </RecordTableCellContent>
    </RecordTablePopover>
  );
};

const SumCreditCell = ({ getValue, row }: any) => {
  const [sumCt, setSumCt] = useState(getValue() as number);
  const { _id } = row.original;

  return (
    <RecordTablePopover scope={`accounting-${_id}-sumCt`}>
      <RecordTableCellTrigger>
        <CurrencyFormatedDisplay
          currencyValue={{
            currencyCode: CurrencyCode.MNT,
            amountMicros: sumCt * 1000000,
          }}
        />
      </RecordTableCellTrigger>
      <RecordTableCellContent>
        <CurrencyField.ValueInput
          value={sumCt}
          onChange={(value) => setSumCt(value)}
        />
      </RecordTableCellContent>
    </RecordTablePopover>
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
      {`${department?.code ? `${department.code} - ` : ''}${
            department?.title ?? ''
          }`}
    </RecordTableCellDisplay>
  );
};

const DateCell = ({ getValue }: any) => {
  return (
    <RecordTableCellDisplay>
      {dayjs(new Date(getValue())).format('YYYY-MM-DD')}
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
  cell: Cell<ITransaction, unknown>;
}) => {
  const { parentId, _id, originId } = cell.row.original;

  return (
    <Link
      to={`/accounting/transaction/edit?parentId=${parentId}&trId=${
        originId || _id
      }`}
    >
      <RecordTable.MoreButton className="w-full h-full" />
    </Link>
  );
};

const transactionMoreColumn = {
  id: 'more',
  cell: TransactionMoreColumnCell,
  size: 33,
};

export const transactionColumns: ColumnDef<ITransaction>[] = [
  transactionMoreColumn,
  RecordTable.checkboxColumn as ColumnDef<ITransaction>,
  {
    id: 'account',
    header: () => (
      <RecordTable.InlineHead icon={IconMoneybag} label="Account" />
    ),
    accessorKey: 'details',
    cell: ({ row }) => <AccountCell row={row} />,
    size: 400,
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
    size: 100,
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
    size: 200,
  },
  {
    id: 'sumDt',
    header: () => (
      <RecordTable.InlineHead icon={IconMoneybag} label="Sum Debit" />
    ),
    accessorKey: 'sumDt',
    cell: ({ getValue, row }) => <SumDebitCell getValue={getValue} row={row} />,
  },
  {
    id: 'sumCt',
    header: () => (
      <RecordTable.InlineHead icon={IconMoneybag} label="Sum Credit" />
    ),
    accessorKey: 'sumCt',
    cell: ({ getValue, row }) => (
      <SumCreditCell getValue={getValue} row={row} />
    ),
  },
  {
    id: 'journal',
    header: () => <RecordTable.InlineHead icon={IconFile} label="Journal" />,
    accessorKey: 'journal',
    cell: ({ getValue, row }) => <JournalCell getValue={getValue} row={row} />,
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
    cell: ({ getValue, row }) => (
      <DepartmentCell getValue={getValue} row={row} />
    ),
  },
];
