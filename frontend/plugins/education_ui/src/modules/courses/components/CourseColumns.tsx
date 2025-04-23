import { useState } from 'react';
import {
  IconAlignLeft,
  IconCurrencyDollar,
  IconLabel,
  IconMap,
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
import { CurrencyDisplay } from 'erxes-ui/components/display/CurrencyDisplay';
import { CurrencyCode } from 'erxes-ui/types/CurrencyCode';
import { CurrencyInput } from 'erxes-ui/modules/record-field/meta-inputs/components/CurrencyInput';

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
    id: 'unitPrice',
    accessorKey: 'unitPrice',
    header: () => (
      <RecordTableInlineHead icon={IconCurrencyDollar} label="Unit Price" />
    ),
    cell: ({ cell }) => {
      const [value, setValue] = useState(cell.getValue() as number);

      return (
        <RecordTableInlineCell
          onSave={() => {
            console.log('Record');
          }}
          getValue={() => cell.getValue()}
          value={value}
          display={() => (
            <CurrencyDisplay
              currencyValue={{
                currencyCode: CurrencyCode.USD,
                amountMicros: value * 1000000,
              }}
            />
          )}
          edit={() => (
            <RecordTableInlineCellEditForm>
              <CurrencyInput
                value={value}
                onChange={(value) => setValue(value)}
              />
            </RecordTableInlineCellEditForm>
          )}
        />
      );
    },
  },
  {
    id: 'location',
    accessorKey: 'location',
    header: () => <RecordTableInlineHead icon={IconMap} label="Location" />,
    cell: ({ cell }) => <TableTextInput cell={cell} />,
  },
  {
    id: 'teacher',
    accessorKey: 'teacher',
    header: () => <RecordTableInlineHead icon={IconSchool} label="Teacher" />,
    cell: ({ cell }) => <TableTextInput cell={cell} />,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: () => <RecordTableInlineHead icon={IconAlignLeft} label="Status" />,
    cell: ({ cell }) => <TableTextInput cell={cell} />,
  },
];
