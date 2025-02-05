import { Checkbox } from 'erxes-ui/components/checkbox';

export const checkboxColumn = {
  accessorKey: 'checkbox',
  id: 'checkbox',
  header: ({ table }) => (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    </div>
  ),
  size: 33,
  cell: ({ row }) => (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    </div>
  ),
};
