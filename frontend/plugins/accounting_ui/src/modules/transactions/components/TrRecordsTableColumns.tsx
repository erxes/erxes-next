import dayjs from 'dayjs';
import { Cell, ColumnDef } from '@tanstack/react-table';
import { ITrRecord } from '../types/Transaction';
import {
  useQueryState,
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
import { useSetAtom } from 'jotai';
import { renderingTransactionDetailState } from '../states/renderingTransactionDetailStates';
import { IconMoneybag, IconFile, IconCalendar } from '@tabler/icons-react';
import { useState } from 'react';

// Create named components for cell renderers to fix React Hook usage
const NumberCell = ({ getValue, row }: any) => {
  const [number, setNumber] = useState(getValue() as string);
  const { _id } = row.original;

  return (
    <RecordTablePopover scope={`transaction-${_id}-number`}>
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
    <RecordTablePopover scope={`transaction-${_id}-description`}>
      <RecordTableCellTrigger>{getValue() as string}</RecordTableCellTrigger>
      <RecordTableCellContent>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </RecordTableCellContent>
    </RecordTablePopover>
  );
};

const SumDebitCell = ({ getValue, row }: any) => {
  const [sumDt, setSumDt] = useState(getValue() as number);
  const { _id } = row.original;

  return (
    <RecordTablePopover scope={`transaction-${_id}-sumDt`}>
      <RecordTableCellTrigger>
        {
          <CurrencyFormatedDisplay
            currencyValue={{
              currencyCode: CurrencyCode.MNT,
              amountMicros: sumDt * 1000000,
            }}
          />
        }
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
    <RecordTablePopover scope={`transaction-${_id}-sumCt`}>
      <RecordTableCellTrigger>
        {
          <CurrencyFormatedDisplay
            currencyValue={{
              currencyCode: CurrencyCode.MNT,
              amountMicros: sumCt * 1000000,
            }}
          />
        }
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

const BranchCell = ({ getValue, row }: any) => {
  const [branch, setBranch] = useState(getValue() as string);
  const { _id } = row.original;

  return (
    <RecordTablePopover scope={`transaction-${_id}-branchId`}>
      <RecordTableCellTrigger>{getValue() as any}</RecordTableCellTrigger>
      <RecordTableCellContent>
        <Input value={branch} onChange={(e) => setBranch(e.target.value)} />
      </RecordTableCellContent>
    </RecordTablePopover>
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
      {`${details?.account?.code} - ${details?.account?.name}`}
    </RecordTableCellDisplay>
  );
};

const TransactionMoreColumnCell = ({
  cell,
}: {
  cell: Cell<ITrRecord, unknown>;
}) => {
  const [, setOpen] = useQueryState('transaction_id');
  const setRenderingContactDetail = useSetAtom(renderingTransactionDetailState);
  const { _id } = cell.row.original;

  return (
    <RecordTable.MoreButton
      className="w-full h-full"
      onClick={() => {
        setOpen(_id);
        setRenderingContactDetail(false);
      }}
    />
  );
};

const transactionMoreColumn = {
  id: 'more',
  cell: TransactionMoreColumnCell,
  size: 33,
};

export const trRecordColumns: ColumnDef<ITrRecord>[] = [
  transactionMoreColumn,
  RecordTable.checkboxColumn as ColumnDef<ITrRecord>,
  {
    id: 'account',
    header: () => (
      <RecordTable.InlineHead icon={IconMoneybag} label="Account" />
    ),
    accessorKey: 'details',
    cell: ({ row }) => <AccountCell row={row} />,
    size: 500,
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
    size: 300,
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
    id: 'branchId',
    header: () => <RecordTable.InlineHead icon={IconFile} label="Branch" />,
    accessorKey: 'branchId',
    cell: ({ getValue, row }) => <BranchCell getValue={getValue} row={row} />,
  },
];
