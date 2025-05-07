import { useState } from 'react';
import type { Cell, ColumnDef } from '@tanstack/react-table';

import { RecordTableInlineHead } from 'erxes-ui/modules/record-table/components/RecordTableInlineHead';
import {
  RecordTableInlineCell,
  RecordTableInlineCellEditForm,
} from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';
import { TextFieldInput } from 'erxes-ui/modules/record-field/meta-inputs/components/TextFieldInput';
import { RecordTable } from 'erxes-ui';
import { classMoreColumn } from './ClassMoreColumn';
import { IClass } from '@/classes/types/type';

const TableTextInput = ({ cell }: { cell: Cell<any, any> }) => {
  const [value, setValue] = useState(cell.getValue() as string);
  return (
    <RecordTableInlineCell
      onSave={() => {
        console.group('+');
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

const checkBoxColumn = RecordTable.checkboxColumn as ColumnDef<IClass>;

export const classColumns: ColumnDef<IClass>[] = [
  classMoreColumn as ColumnDef<IClass>,
  checkBoxColumn,
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTableInlineHead label="Name" />,
    cell: ({ cell }) => <TableTextInput cell={cell} />,
  },
];
