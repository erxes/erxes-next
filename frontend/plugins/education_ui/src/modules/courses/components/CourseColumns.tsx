import { useState } from 'react';
import type { Cell, ColumnDef } from '@tanstack/react-table';

import { RecordTableInlineHead } from 'erxes-ui/modules/record-table/components/RecordTableInlineHead';
import { ICourse } from '@/courses/types/courseType';
import {
  RecordTableInlineCell,
  RecordTableInlineCellEditForm,
} from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';
import { TextFieldInput } from 'erxes-ui/modules/record-field/meta-inputs/components/TextFieldInput';
import { RecordTable, Slider } from 'erxes-ui';
import { useCourseEdit } from '@/courses/hooks/useCourseEdit';
import { ActionField, PriceField, SwitchField } from '@/courses/edit-course';
import { courseMoreColumn } from './CourseMoreColumn';

const TableTextInput = ({ cell }: { cell: Cell<any, any> }) => {
  const [value, setValue] = useState(cell.getValue() as string);
  const { courseEdit } = useCourseEdit();
  return (
    <RecordTableInlineCell
      onSave={() => {
        courseEdit({
          variables: {
            id: cell.row.original._id,
            [cell.column.id]: value,
          },
        });
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

const checkBoxColumn = RecordTable.checkboxColumn as ColumnDef<ICourse>;

export const courseColumns: ColumnDef<ICourse>[] = [
  courseMoreColumn as ColumnDef<ICourse>,
  checkBoxColumn,
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTableInlineHead label="Name" />,
    cell: ({ cell }) => <TableTextInput cell={cell} />,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: () => <RecordTableInlineHead label="Description" />,
    cell: ({ cell }) => <TableTextInput cell={cell} />,
  },

  {
    id: 'status',
    accessorKey: 'status',
    size: 100,
    header: () => <RecordTableInlineHead label="Status" />,
    cell: ({ cell }) => <SwitchField cell={cell} />,
  },
  {
    id: 'enrollment',
    accessorKey: 'enrollment',
    header: () => <RecordTableInlineHead label="Enrollment" />,
    cell: ({ cell }) => {
      const randomNumber = Math.floor(Math.random() * 100);
      return (
        <div className="flex items-center gap-3 pr-3 pl-2">
          <Slider hideThumb max={100} defaultValue={[randomNumber]} step={1} />
          <span className="text-primary font-semibold">{randomNumber}%</span>
        </div>
      );
    },
  },
  {
    id: 'unitPrice',
    accessorKey: 'unitPrice',
    header: () => <RecordTableInlineHead label="Unit Price" />,
    cell: ({ cell }) => <PriceField cell={cell} />,
  },
  // {
  //   id: 'location',
  //   accessorKey: 'location',
  //   header: () => <RecordTableInlineHead icon={IconMap} label="Location" />,
  //   cell: ({ cell }) => <TableTextInput cell={cell} />,
  // },
  {
    id: 'teacher',
    accessorKey: 'teacher',
    header: () => <RecordTableInlineHead label="Teacher" />,
    cell: ({ cell }) => <TableTextInput cell={cell} />,
  },
  {
    id: 'actions',
    accessorKey: 'actions',
    header: () => <RecordTableInlineHead label="Actions" />,
    cell: ({ cell }) => <ActionField cell={cell} />,
  },
];
