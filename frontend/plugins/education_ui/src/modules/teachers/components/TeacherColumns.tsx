import {
  IconAlignLeft,
  IconMail,
  IconNumber,
  IconPhone,
} from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';

import {
  RecordTable,
  TextOverflowTooltip,
  RecordTableCellDisplay,
} from 'erxes-ui';
import { ITeacher } from '@/teachers/types/teacherType';

const checkBoxColumn = RecordTable.checkboxColumn as ColumnDef<ITeacher>;

export const teacherColumns: ColumnDef<ITeacher>[] = [
  checkBoxColumn,
  {
    id: 'firstName',
    accessorKey: 'user',
    header: () => (
      <RecordTable.InlineHead icon={IconAlignLeft} label="First name" />
    ),
    cell: ({ cell }) => {
      const value = cell.getValue() as ITeacher['user'];
      const { firstName } = value?.details || {};
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={firstName} />
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'lastName',
    accessorKey: 'user',
    header: () => (
      <RecordTable.InlineHead icon={IconAlignLeft} label="Last name" />
    ),
    cell: ({ cell }) => {
      const value = cell.getValue() as ITeacher['user'];
      const { lastName } = value?.details || {};
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={lastName} />
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'employeeId',
    accessorKey: 'user',
    header: () => (
      <RecordTable.InlineHead icon={IconNumber} label="Employee ID" />
    ),
    cell: ({ cell }) => {
      const value = cell.getValue() as ITeacher['user'];
      const employeeId = value?.employeeId || '';
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={employeeId} />
        </RecordTableCellDisplay>
      );
    },
  },

  {
    id: 'operatorPhone',
    accessorKey: 'user',
    header: () => (
      <RecordTable.InlineHead icon={IconPhone} label="Phone Number" />
    ),
    cell: ({ cell }) => {
      const value = cell.getValue() as ITeacher['user'];
      const { operatorPhone } = value?.details || {};
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={operatorPhone} />
        </RecordTableCellDisplay>
      );
    },
  },

  {
    id: 'email',
    accessorKey: 'user',
    header: () => <RecordTable.InlineHead icon={IconMail} label="Email" />,
    cell: ({ cell }) => {
      const value = cell.getValue() as ITeacher['user'];
      const email = value?.email || '';
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={email} />
        </RecordTableCellDisplay>
      );
    },
  },

  // {
  //   id: 'email',
  //   accessorKey: 'email',
  //   header: () => <RecordTable.InlineHead icon={IconMail} label="Email" />,
  //   cell: ({ cell }) => {
  //     const { email, _id } = cell.row.original;
  //     return (
  //       <RecordTablePopover>
  //         <RecordTableCellTrigger asChild>{email}</RecordTableCellTrigger>
  //         <RecordTableCellContent>
  //           <Input key={_id} value={email} />
  //         </RecordTableCellContent>
  //       </RecordTablePopover>
  //     );
  //   },
  // },
];
