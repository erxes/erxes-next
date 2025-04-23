import { useState } from 'react';
import {
  IconCategoryPlus,
  IconCurrencyDollar,
  IconLabel,
  IconSchool,
} from '@tabler/icons-react';
import type { Cell, ColumnDef } from '@tanstack/react-table';

import { RecordTableInlineHead } from 'erxes-ui/modules/record-table/components/RecordTableInlineHead';
import { ICourse } from '@/courses/types/courseType';
import {
  RecordTableInlineCell,
  RecordTableInlineCellEditForm,
} from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';
import { TextFieldInput } from 'erxes-ui/modules/record-field/meta-inputs/components/TextFieldInput';
import { Select } from 'erxes-ui';
import { COURSE_TYPE_OPTIONS } from '@/courses/constants/CourseConstants';
import { useCourseEdit } from '@/courses/hooks/useCourseEdit';
import { PriceField, SwitchField } from '@/courses/edit-course';

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
    id: 'type',
    accessorKey: 'type',
    header: () => (
      <RecordTableInlineHead icon={IconCategoryPlus} label="Type" />
    ),
    cell: ({ cell }) => {
      const result =
        COURSE_TYPE_OPTIONS.find((type) => type.value === cell.getValue())
          ?.label || ' ';

      return (
        <RecordTableInlineCell
          display={() => <span>{result}</span>}
          edit={({ isInEditMode, setIsInEditMode }) => (
            <Select open={isInEditMode} onOpenChange={setIsInEditMode}>
              <Select.Trigger className="w-full h-cell rounded-none">
                <Select.Value placeholder="Select type" />
              </Select.Trigger>
              <Select.Content>
                {COURSE_TYPE_OPTIONS.map((type) => (
                  <Select.Item value={type.value} key={type.value}>
                    {type.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          )}
        />
      );
    },
  },
  {
    id: 'unitPrice',
    accessorKey: 'unitPrice',
    header: () => (
      <RecordTableInlineHead icon={IconCurrencyDollar} label="Unit Price" />
    ),
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
    header: () => <RecordTableInlineHead icon={IconSchool} label="Teacher" />,
    cell: ({ cell }) => <TableTextInput cell={cell} />,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: () => <RecordTableInlineHead label="Status" />,
    cell: ({ cell }) => <SwitchField cell={cell} />,
  },
];
