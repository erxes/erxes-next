import dayjs from 'dayjs';
import { Cell, ColumnDef } from '@tanstack/react-table';
import { IAdjustInventory } from '../types/AdjustInventory';
import { Link } from 'react-router-dom';
import {
  RecordTable,
  Input,
  RecordTablePopover,
  RecordTableCellTrigger,
  RecordTableCellContent,
  RecordTableCellDisplay,
  CurrencyFormatedDisplay,
  CurrencyCode,
} from 'erxes-ui';
import { IconFile, IconCalendar, IconMoneybag } from '@tabler/icons-react';
import { useState } from 'react';

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

// const DateCell = ({ getValue }: any) => {
//   return (
//     <RecordTableCellDisplay>
//       {dayjs(new Date(getValue())).format('YYYY-MM-DD')}
//     </RecordTableCellDisplay>
//   );
// };

const ProductCell = ({ row }: any) => {
  return (
    <RecordTableCellDisplay>
      {`${row.original.product?.code} - ${row.original.product?.name}`}
    </RecordTableCellDisplay>
  );
};

const AccountCell = ({ row }: any) => {
  return (
    <RecordTableCellDisplay>
      {`${row.original.account?.code} - ${row.original.account?.name}`}
    </RecordTableCellDisplay>
  );
};

const BranchCell = ({ row }: any) => {
  return (
    <RecordTableCellDisplay>
      {`${row.original.branch?.code} - ${row.original.branch?.title}`}
    </RecordTableCellDisplay>
  );
};

const DepartmentCell = ({ row }: any) => {
  return (
    <RecordTableCellDisplay>
      {`${row.original.department?.code} - ${row.original.department?.title}`}
    </RecordTableCellDisplay>
  );
};

const NumberCell = ({ getValue }: any) => {
  const value = getValue() as number;

  return (
    <RecordTableCellDisplay>
      <CurrencyFormatedDisplay
        currencyValue={{
          currencyCode: CurrencyCode.MNT,
          amountMicros: value,
        }}
      />
    </RecordTableCellDisplay>
  );
};

const TransactionMoreColumnCell = ({
  cell,
}: {
  cell: Cell<IAdjustInventory, unknown>;
}) => {
  const { _id } = cell.row.original;

  return (
    <Link
      to={`/accounting/adjustment/inventory/detail?id=${_id}`}
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

export const adjustDetailTableColumns: ColumnDef<IAdjustInventory>[] = [
  transactionMoreColumn,
  // {
  //   id: 'date',
  //   header: () => <RecordTable.InlineHead icon={IconCalendar} label="Date" />,
  //   accessorKey: 'date',
  //   cell: ({ getValue, row }) => <DateCell getValue={getValue} row={row} />,
  // },
  {
    id: 'product',
    header: () => (
      <RecordTable.InlineHead icon={IconMoneybag} label="Product" />
    ),
    accessorKey: 'product',
    cell: ({ row }) => <ProductCell row={row} />,
    size: 300,
  },
  {
    id: 'account',
    header: () => (
      <RecordTable.InlineHead icon={IconMoneybag} label="Account" />
    ),
    accessorKey: 'account',
    cell: ({ row }) => <AccountCell row={row} />,
    size: 300,
  },
  {
    id: 'branch',
    header: () => (
      <RecordTable.InlineHead icon={IconMoneybag} label="Branch" />
    ),
    accessorKey: 'branch',
    cell: ({ row }) => <BranchCell row={row} />,
    size: 200,
  },
  {
    id: 'department',
    header: () => (
      <RecordTable.InlineHead icon={IconMoneybag} label="Department" />
    ),
    accessorKey: 'department',
    cell: ({ row }) => <DepartmentCell row={row} />,
    size: 200,
  },
  {
    id: 'remainder',
    header: () => (
      <RecordTable.InlineHead icon={IconMoneybag} label="Remainder" />
    ),
    accessorKey: 'remainder',
    cell: ({ getValue, row }) => (
      <NumberCell getValue={getValue} />
    ),
  },
  {
    id: 'unitCost',
    header: () => (
      <RecordTable.InlineHead icon={IconMoneybag} label="Unit Cost" />
    ),
    accessorKey: 'unitCost',
    cell: ({ getValue, row }) => (
      <NumberCell getValue={getValue} />
    ),
  },
  {
    id: 'cost',
    header: () => (
      <RecordTable.InlineHead icon={IconMoneybag} label="Sum Cost" />
    ),
    accessorKey: 'cost',
    cell: ({ getValue, row }) => (
      <NumberCell getValue={getValue} />
    ),
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
  }
];
