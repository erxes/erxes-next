import {
  IconLabel,
  IconCategoryFilled,
  IconLabelFilled,
  IconCalendarPlus,
} from '@tabler/icons-react';
import type { ColumnDef, Cell } from '@tanstack/react-table';

import { Avatar, RecordTable, RelativeDateDisplay } from 'erxes-ui';
import { RecordTableInlineHead } from 'erxes-ui/modules/record-table/components/RecordTableInlineHead';
import { RecordTableInlineCell } from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';

// import { ICustomer } from '@/contacts/types/customerType';
// import { FullNameField } from '../customer-edit/components/FullNameField';
// import { EmailField } from '../customer-edit/components/EmailField';
// import { PhoneField } from '../customer-edit/components/PhoneField';
// import { TextFieldCustomer } from '../customer-edit/components/TextField';
// import { TagsField } from '@/contacts/customer-edit/components/TagsField';

export const cmsColumns: ColumnDef<any>[] = [
  {
    id: 'postName',
    accessorKey: 'postName',
    header: () => <RecordTableInlineHead icon={IconLabel} label="POST NAME" />,
    cell: ({ cell }) => {
      const { name, lastName, middleName, _id } = cell.row.original;

      return (
        <div className="p-2">
          {name} <br />
        </div>
      );
    },
  },
  {
    id: 'postName',
    accessorKey: 'postName',
    header: () => <RecordTableInlineHead icon={IconLabel} label="POST NAME" />,
    cell: ({ cell }) => {
      const { name, lastName, middleName, _id } = cell.row.original;

      return (
        <div className="p-2">
          {name} <br />
        </div>
      );
    },
  },
  {
    id: 'category',
    accessorKey: 'category',
    header: () => (
      <RecordTableInlineHead icon={IconCategoryFilled} label="CATEGORY" />
    ),
    cell: ({ cell }) => {
      const { category, lastName, middleName, _id } = cell.row.original;

      return (
        <div className="p-2">
          {category[0].name} <br />
        </div>
      );
    },
  },
  {
    id: 'tag',
    accessorKey: 'tag',
    header: () => <RecordTableInlineHead icon={IconLabelFilled} label="TAG" />,
    cell: ({ cell }) => {
      const { tag, lastName, middleName, _id } = cell.row.original;

      return (
        <div className="p-2 bg-[#4F46E51A]/10 text-[#4F46E5]">
          {tag[0].name} <br />
        </div>
      );
    },
  },
  {
    id: 'createdDate',
    accessorKey: 'createdDate',
    header: () => (
      <RecordTableInlineHead icon={IconCalendarPlus} label="CREATED DATE" />
    ),
    cell: ({ cell }) => {
      const { createdDate, lastName, middleName, _id } = cell.row.original;

      return (
        <div className="p-2">
          {createdDate} <br />
        </div>
      );
    },
  },
  {
    id: 'modifiedDate',
    accessorKey: 'modifiedD',
    header: () => (
      <RecordTableInlineHead icon={IconCalendarPlus} label="MODIFIED DATE" />
    ),
    cell: ({ cell }) => {
      const { modifiedDate, lastName, middleName, _id } = cell.row.original;

      return (
        <div className="p-2">
          {modifiedDate} <br />
        </div>
      );
    },
  },
];
