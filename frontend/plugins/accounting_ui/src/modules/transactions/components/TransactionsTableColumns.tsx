import dayjs from 'dayjs';
import { Cell, ColumnDef } from '@tanstack/react-table';
import { ITransaction } from '../types/Transaction';
import {
  RecordTable,
  InlineCell,
  InlineCellDisplay,
  InlineCellEdit,
  Input,
  CurrencyCode,
  CurrencyField,
  CurrencyFormatedDisplay,
} from 'erxes-ui';
import { IconMoneybag, IconFile, IconCalendar } from '@tabler/icons-react';
import { useState } from 'react';
import { Link } from 'react-router';

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

const SumDebitCell = ({ getValue, row }: any) => {
  const [sumDt, setSumDt] = useState(getValue() as number);
  const { _id } = row.original;

  return (
    <InlineCell
      name="sumDt"
      recordId={_id || ''}
      display={() => (
        <InlineCellDisplay>
          <CurrencyFormatedDisplay
            currencyValue={{
              currencyCode: CurrencyCode.MNT,
              amountMicros: sumDt * 1000000,
            }}
          />
        </InlineCellDisplay>
      )}
      edit={() => (
        <InlineCellEdit>
          <CurrencyField.ValueInput
            value={sumDt}
            onChange={(value) => setSumDt(value)}
          />
        </InlineCellEdit>
      )}
    />
  );
};

const SumCreditCell = ({ getValue, row }: any) => {
  const [sumCt, setSumCt] = useState(getValue() as number);
  const { _id } = row.original;

  return (
    <InlineCell
      name="sumCt"
      recordId={_id || ''}
      display={() => (
        <InlineCellDisplay>
          <CurrencyFormatedDisplay
            currencyValue={{
              currencyCode: CurrencyCode.MNT,
              amountMicros: sumCt * 1000000,
            }}
          />
        </InlineCellDisplay>
      )}
      edit={() => (
        <InlineCellEdit>
          <CurrencyField.ValueInput
            value={sumCt}
            onChange={(value) => setSumCt(value)}
          />
        </InlineCellEdit>
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
  cell: Cell<ITransaction, unknown>;
}) => {
  const { parentId, _id } = cell.row.original;

  return (
    <Link to={`/accounting/transaction/edit/${parentId}?trId=${_id}`}>
      <RecordTable.MoreButton
        className="w-full h-full"
      />
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
