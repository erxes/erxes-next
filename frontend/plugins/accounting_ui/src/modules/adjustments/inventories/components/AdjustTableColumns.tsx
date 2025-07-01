import dayjs from 'dayjs';
import { Cell, ColumnDef } from '@tanstack/react-table';
import { ITrRecord } from '../types/AdjustInventory';
import {
  useQueryState,
  RecordTable,
  Input,
  RecordTablePopover,
  RecordTableCellTrigger,
  RecordTableCellContent,
  RecordTableCellDisplay,
} from 'erxes-ui';
import { IconFile, IconCalendar } from '@tabler/icons-react';
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

const DateCell = ({ getValue }: any) => {
  return (
    <RecordTableCellDisplay>
      {dayjs(new Date(getValue())).format('YYYY-MM-DD')}
    </RecordTableCellDisplay>
  );
};

const TransactionMoreColumnCell = ({
  cell,
}: {
  cell: Cell<ITrRecord, unknown>;
}) => {
  const [, setOpen] = useQueryState('transaction_id');
  const { _id } = cell.row.original;

  return (
    <RecordTable.MoreButton
      className="w-full h-full"
      onClick={() => {
        setOpen(_id);
      }}
    />
  );
};

const transactionMoreColumn = {
  id: 'more',
  cell: TransactionMoreColumnCell,
  size: 33,
};

export const adjustTableColumns: ColumnDef<ITrRecord>[] = [
  transactionMoreColumn,
  RecordTable.checkboxColumn as ColumnDef<ITrRecord>,
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
  }
];
