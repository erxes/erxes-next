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

export const fieldsColumns: ColumnDef<any>[] = [
  {
    id: 'label',
    accessorKey: 'label',
    header: () => <RecordTableInlineHead icon={IconLabel} label="LABEL" />,
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
    id: 'key',
    accessorKey: 'key',
    header: () => <RecordTableInlineHead icon={IconLabelFilled} label="KEY" />,
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
    id: 'type',
    accessorKey: 'type',
    header: () => (
      <RecordTableInlineHead icon={IconCalendarPlus} label="TYPE" />
    ),
    cell: ({ cell }) => {
      const { type, lastName, middleName, _id } = cell.row.original;

      return (
        <div className="p-2">
          {type} <br />
        </div>
      );
    },
  },
];
