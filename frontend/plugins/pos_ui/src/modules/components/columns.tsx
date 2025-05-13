import { useState } from 'react';

import {
  IconBuilding,
  IconChartBar,
  IconLabel,
  IconMobiledata,
  IconPhone
} from '@tabler/icons-react';
import { Cell, ColumnDef } from '@tanstack/react-table';

import { Badge } from 'erxes-ui';
import { TextFieldInput } from 'erxes-ui/modules/record-field/meta-inputs/components/TextFieldInput';
import { RecordTableInlineHead } from 'erxes-ui/modules/record-table/components/RecordTableInlineHead';
import {
  RecordTableInlineCell,
  RecordTableInlineCellEditForm,
} from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';
// import { RelativeDateDisplay } from 'erxes-ui/components/display/relativeDateDisplay';

const TableTextInput = ({ cell }: { cell: Cell<any, any> }) => {
  const [value, setValue] = useState(cell.getValue() as string);
  // const { posEdit } = usePosEdit();
  return (
    <RecordTableInlineCell
      onSave={() => {
        // posEdit({
        //   variables: {
        //     _id: cell.row.original._id,
        //     [cell.column.id]: value,
        //   },
        // });
        console.log('Saving', value);
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

export const columns: ColumnDef<any>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTableInlineHead icon={IconLabel} label="Name" />,
    cell: ({ cell }) => <TableTextInput cell={cell} />,
  },
  {
    id: 'isOnline',
    accessorKey: 'isOnline',
    header: () => <RecordTableInlineHead icon={IconMobiledata} label="Is Online" />,
    cell: ({ cell }) => {
      const value = cell.getValue() as boolean;
      return (
        <RecordTableInlineCell
          display={() => (
            <Badge
              variant={value ? "success" : "secondary"}
            >
              {value ? 'Online' : 'Offline POS'}
            </Badge>
          )}
        />
      );
    },
  },
  {
    id: 'onServer',
    accessorKey: 'onServer',
    header: () => <RecordTableInlineHead icon={IconPhone} label="On Server" />,
    cell: ({ cell }) => {
      const value = cell.getValue() as boolean;
      return (
        <RecordTableInlineCell
          display={() => (
            <Badge variant="default">
              {value ? 'On server' : 'Not on server'}
            </Badge>
          )}
        />
      );
    },
  },
  {
    id: 'branchTitle',
    accessorKey: 'branchTitle',
    header: () => <RecordTableInlineHead icon={IconBuilding} label="Branch" />,
    cell: ({ cell }) => <TableTextInput cell={cell} />,
  },
  {
    id: 'departmentTitle',
    accessorKey: 'departmentTitle',
    header: () => <RecordTableInlineHead icon={IconChartBar} label="Department" />,
    cell: ({ cell }) => <TableTextInput cell={cell} />,
  },
  // {
  //   id: 'createdAt',
  //   accessorKey: 'createdAt',
  //   header: () => <RecordTableInlineHead icon={IconClock} label="Created At" />,
  //   cell: ({ cell }) => (
  //     <RecordTableInlineCell
  //       display={() => (
  //         <RelativeDateDisplay value={cell.getValue() as string} />
  //       )}
  //     />
  //   ),
  // },
];