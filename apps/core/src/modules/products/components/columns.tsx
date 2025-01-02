import {
  IconBuilding,
  IconChartBar,
  IconCircleCheck,
  IconHash,
  IconHistory,
  IconAlignLeft,
  IconPlus,
  IconTags,
  IconCurrencyDollar,
} from '@tabler/icons-react';

export const columns = [
  {
    id: 'name',
    icon: IconAlignLeft,
    type: 'handle',
    readOnly: true,
  },
  {
    id: 'code',
    icon: IconHash,
    type: 'handle',
  },
  {
    id: 'unitPrice',
    icon: IconCurrencyDollar,
    type: 'currency',
  },
  {
    id: 'categoryId',
    icon: IconChartBar,
    type: 'chip',
  },
  {
    id: 'status',
    icon: IconCircleCheck,
    type: 'handle',
  },
  {
    id: 'createdAt',
    icon: IconHistory,
    type: 'date',
  },
  {
    id: 'tagIds',
    icon: IconTags,
    type: 'multiselect',
  },
  {
    id: 'vendor',
    icon: IconBuilding,
    type: 'handle',
  },
  {
    id: 'type',
    icon: IconPlus,
    type: 'handle',
  },
];

// export const columns: ColumnDef<ProductT>[] = [
//   {
//     accessorKey: 'checkbox',
//     id: 'checkbox',
//     header: ({ table }) => (
//       <div className="flex items-center justify-center">
//         <Checkbox
//           checked={
//             table.getIsAllPageRowsSelected() ||
//             (table.getIsSomePageRowsSelected() && 'indeterminate')
//           }
//           onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         />
//       </div>
//     ),
//     size: 40,
//     cell: ({ row }) => (
//       <div className="flex items-center justify-center">
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => row.toggleSelected(!!value)}
//         />
//       </div>
//     ),
//   },
//   {
//     accessorKey: 'name',
//     id: 'name',
//     header: () => (
//       <div className="flex items-center gap-1">
//         <IconAlignLeft className="w-4 h-4" strokeWidth={2.5} />
//         Name
//       </div>
//     ),
//     cell: ProductNameCell,
//     size: 280,
//   },
//   {
//     accessorKey: 'code',
//     id: 'code',
//     header: () => (
//       <div className="flex items-center gap-1">
//         <IconHash className="w-4 h-4" strokeWidth={2.5} />
//         Code
//       </div>
//     ),
//     cell: (info) => (
//       <div className="flex items-center gap-1 px-2">
//         {info.getValue() as string}
//       </div>
//     ),
//     size: 180,
//   },
//   {
//     id: 'unitPrice',
//     accessorKey: 'unitPrice',
//     header: () => (
//       <div className="flex items-center gap-1">
//         <IconCurrencyTugrik className="w-4 h-4" strokeWidth={2.5} />
//         Price
//       </div>
//     ),
//     cell: (info) => <PriceCell {...info} />,
//     size: 180,
//   },
//   {
//     accessorKey: 'categoryId',
//     id: 'category',
//     header: () => (
//       <div className="flex items-center gap-1">
//         <IconChartBar className="w-4 h-4" strokeWidth={2.5} />
//         Category
//       </div>
//     ),
//     cell: CategoryCell,
//     size: 280,
//   },
//   {
//     accessorKey: 'status',
//     id: 'status',
//     header: () => (
//       <div className="flex items-center gap-1">
//         <IconCircleCheck className="w-4 h-4" strokeWidth={2.5} />
//         Status
//       </div>
//     ),
//     cell: StatusCell,
//     size: 180,
//   },
//   {
//     accessorKey: 'createdAt',
//     id: 'createdAt',
//     header: (info) => (
//       <div className="flex items-center gap-1">
//         <IconHistory className="w-4 h-4" strokeWidth={2.5} />
//         Created At
//       </div>
//     ),
//     cell: (info) => <RelativeDateDisplay date={info.getValue() as string} />,
//     size: 180,
//   },
//   {
//     accessorKey: 'tagIds',
//     id: 'tags',
//     header: () => (
//       <div className="flex items-center gap-1">
//         <IconTags className="w-4 h-4" strokeWidth={2.5} />
//         Tags
//       </div>
//     ),
//     cell: TagsCell,
//     size: 280,
//   },
//   {
//     accessorKey: 'vendor',
//     id: 'vendor',
//     header: () => (
//       <div className="flex items-center gap-1">
//         <IconBuilding className="w-4 h-4" strokeWidth={2.5} />
//         Vendor
//       </div>
//     ),
//     cell: (info) => (
//       <Button size="sm" variant="secondary">
//         <Avatar.Root>
//           <Avatar.Image />
//           <Avatar.Fallback className="bg-blue-100 text-blue-800">
//             {((info.getValue() || '') as string).charAt(0)}
//           </Avatar.Fallback>
//         </Avatar.Root>
//         {info.getValue() as string}
//       </Button>
//     ),
//     size: 280,
//   },
//   {
//     accessorKey: 'type',
//     id: 'type',
//     header: 'Type',
//     size: 180,
//     cell: ProductTypeCell,
//   },
//   {
//     accessorKey: 'add',
//     id: 'add',
//     size: 70,
//     header: () => (
//       <Button variant="ghost" className="h-full w-full">
//         <IconPlus className="w-4 h-4" strokeWidth={2.5} />
//       </Button>
//     ),
//   },
// ];
