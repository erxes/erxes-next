import {
  IconAlignLeft,
  IconCalendarPlus,
  IconHash,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react';
import { Cell, ColumnDef } from '@tanstack/table-core';
import {
  Badge,
  Button,
  Input,
  RecordTable,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTablePopover,
  RelativeDateDisplay,
  Textarea,
  TextOverflowTooltip,
  useQueryState,
} from 'erxes-ui';
import { useSetAtom } from 'jotai';
import { renderingBrandDetailAtom } from '../state';
import { IBrand } from '../types';


export const brandsColumns: ColumnDef<IBrand>[] = [
  RecordTable.checkboxColumn as ColumnDef<IBrand>,
  {
    id: 'name',
    accessorKey: 'name',
    header: () => (
      <RecordTable.InlineHead label="brand name" icon={IconAlignLeft} />
    ),
    cell: ({ cell }) => {
      const [, setBrandDetail] = useQueryState('brand_id');
      const setRenderingBrandDetail = useSetAtom(renderingBrandDetailAtom);
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <Badge
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                setRenderingBrandDetail(true);
                setBrandDetail(cell.row.original._id);
              }}
            >
              {cell.getValue() as string}
            </Badge>
          </RecordTableCellTrigger>
          <RecordTableCellContent className="min-w-72">
            <Input value={cell.getValue() as string} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
    size: 250,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: () => (
      <RecordTable.InlineHead label="description" icon={IconHash} />
    ),
    cell: ({ cell }) => {
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <TextOverflowTooltip value={cell.getValue() as string} />
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Textarea value={cell.getValue() as string} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
    size: 350,
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: () => <RecordTable.InlineHead label="code" icon={IconHash} />,
    cell: ({ cell }) => {
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <Badge variant={'secondary'}>{cell.getValue() as number}</Badge>
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input value={cell.getValue() as string} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: () => (
      <RecordTable.InlineHead label="date created" icon={IconCalendarPlus} />
    ),
    cell: ({ cell }) => {
      return (
        <RelativeDateDisplay value={cell.getValue() as string} asChild>
          <RecordTableCellDisplay>
            <RelativeDateDisplay.Value value={cell.getValue() as string} />
          </RecordTableCellDisplay>
        </RelativeDateDisplay>
      );
    },
  },
];
