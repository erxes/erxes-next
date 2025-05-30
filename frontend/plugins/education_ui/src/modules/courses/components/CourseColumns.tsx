import type { ColumnDef } from '@tanstack/react-table';
import { RecordTableInlineHead } from 'erxes-ui/modules/record-table/components/RecordTableInlineHead';
import { ICourse } from '@/courses/types/courseType';
import {
  RecordTable,
  RecordTableCellDisplay,
  Slider,
  TextOverflowTooltip,
} from 'erxes-ui';
import { ActionField, SwitchField } from '@/courses/edit-course';
import { courseMoreColumn } from './CourseMoreColumn';

export const courseColumns: ColumnDef<ICourse>[] = [
  courseMoreColumn as ColumnDef<ICourse>,
  RecordTable.checkboxColumn as ColumnDef<ICourse>,
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTableInlineHead label="Name" />,
    cell: ({ cell }) => (
      <RecordTableCellDisplay>
        <TextOverflowTooltip value={cell.getValue() as string} />
      </RecordTableCellDisplay>
    ),
  },
  {
    id: 'class',
    accessorKey: 'class',
    header: () => <RecordTableInlineHead label="Class" />,
    cell: ({ cell }) => {
      const value = cell.getValue() as { name?: string } | undefined;
      const name = value?.name || '';
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={name as string} />
        </RecordTableCellDisplay>
      );
    },
    size: 100,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: () => <RecordTableInlineHead label="Description" />,
    cell: ({ cell }) => (
      <RecordTableCellDisplay>
        <TextOverflowTooltip value={cell.getValue() as string} />
      </RecordTableCellDisplay>
    ),
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
      return (
        <div className="flex items-center gap-3 pr-3 pl-2">
          <Slider hideThumb max={100} defaultValue={[80]} step={1} />
          <span className="text-primary font-semibold">{80}%</span>
        </div>
      );
    },
  },
  {
    id: 'teacher',
    accessorKey: 'teacher',
    header: () => <RecordTableInlineHead label="Teacher" />,
    cell: ({ cell }) => (
      <RecordTableCellDisplay>
        <TextOverflowTooltip value={cell.getValue() as string} />
      </RecordTableCellDisplay>
    ),
  },
  {
    id: 'actions',
    accessorKey: 'actions',
    header: () => <RecordTableInlineHead label="Actions" />,
    cell: ({ cell }) => <ActionField cell={cell} />,
  },
];
