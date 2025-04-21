import { IconAlignLeft, IconLabel } from '@tabler/icons-react';
import type { Cell, ColumnDef } from '@tanstack/react-table';

import { RecordTableInlineHead } from 'erxes-ui/modules/record-table/components/RecordTableInlineHead';
import { ICourse } from '@/courses/types/courseType';
import { useState } from 'react';
import {
  RecordTableInlineCell,
  RecordTableInlineCellEditForm,
} from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';
import { TextFieldInput } from 'erxes-ui/modules/record-field/meta-inputs/components/TextFieldInput';

const TableTextInput = ({ cell }: { cell: Cell<any, any> }) => {
  const [value, setValue] = useState(cell.getValue() as string);
  return (
    <RecordTableInlineCell
      onSave={() => {
        // productsEdit({
        //   variables: {
        //     _id: cell.row.original._id,
        //     [cell.column.id]: value,
        //     uom: cell.row.original.uom,
        //   },
        // });
      }}
      getValue={() => cell.getValue()}
      value={value}
      display={() => value}
      edit={() => (
        <RecordTableInlineCellEditForm>
          <TextFieldInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </RecordTableInlineCellEditForm>
      )}
    />
  );
};

export const courseColumns: ColumnDef<ICourse>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTableInlineHead icon={IconLabel} label="Name" />,
    cell: ({ cell }) => <TableTextInput cell={cell} />,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: () => (
      <RecordTableInlineHead icon={IconLabel} label="Description" />
    ),
    cell: ({ cell }) => <TableTextInput cell={cell} />,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: () => <RecordTableInlineHead icon={IconAlignLeft} label="Status" />,
    cell: ({ cell }) => <TableTextInput cell={cell} />,
  },
];
