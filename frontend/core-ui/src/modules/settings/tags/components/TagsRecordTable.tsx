import { IconEdit, IconTrash } from '@tabler/icons-react';
import { Cell, ColumnDef } from '@tanstack/react-table';
import {
  Badge,
  Combobox,
  Command,
  Input,
  Popover,
  RecordTable,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTablePopover,
  RecordTableTree,
  useConfirm,
  useMultiQueryState,
  useQueryState,
} from 'erxes-ui';
import { ITag, SelectTags, useTags } from 'ui-modules';
import { useRemoveTag } from '../hooks/useRemoveTag';

export const TagMoreColumnCell = ({
  cell,
}: {
  cell: Cell<ITag & { hasChildren: boolean }, unknown>;
}) => {
  const confirmOptions = { confirmationValue: 'delete' };
  const { confirm } = useConfirm();
  const [, setOpen] = useQueryState('tagId');
  const { removeTag, loading } = useRemoveTag();
  const { _id } = cell.row.original;

  const onRemove = () => {
    confirm({
      message: 'Are you sure you want to remove the selected?',
      options: confirmOptions,
    }).then(async () => {
      try {
        removeTag(_id);
      } catch (e) {
        console.error(e.message);
      }
    });
  };
  return (
    <Popover>
      <Popover.Trigger asChild>
        <RecordTable.MoreButton className="w-full h-full" />
      </Popover.Trigger>
      <Combobox.Content>
        <Command shouldFilter={false}>
          <Command.List>
            <Command.Item
              value="edit"
              onSelect={() => {
                setOpen(_id);
              }}
            >
              <IconEdit /> Edit
            </Command.Item>
            <Command.Item disabled={loading} value="remove" onSelect={onRemove}>
              <IconTrash /> Delete
            </Command.Item>
          </Command.List>
        </Command>
      </Combobox.Content>
    </Popover>
  );
};

export const tagsColumns: ColumnDef<ITag & { hasChildren: boolean }>[] = [
  {
    id: 'more',
    cell: TagMoreColumnCell,
    size: 33,
  },
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    cell: ({ cell }) => {
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <RecordTableTree.Trigger
              order={cell.row.original.order}
              name={cell.getValue() as string}
              hasChildren={cell.row.original.hasChildren}
            >
              {cell.getValue() as string}
            </RecordTableTree.Trigger>
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input value={cell.getValue() as string} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
    size: 300,
  },

  {
    header: 'Parent',
    accessorKey: 'parentId',
    cell: ({ cell }) => {
      return (
        <SelectTags.InlineCell
          scope="tag"
          mode="single"
          value={cell.getValue() as string}
          onValueChange={(value) => {
            console.log(value);
          }}
          tagType=""
        />
      );
    },
    size: 200,
  },
  {
    header: 'Total item counts',
    accessorKey: 'totalObjectCount',
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay className="justify-center">
          {cell.getValue() as number}
        </RecordTableCellDisplay>
      );
    },
  },
  {
    header: 'Item counts',
    accessorKey: 'objectCount',
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay className="justify-center">
          {cell.getValue() as number}
        </RecordTableCellDisplay>
      );
    },
  },
  {
    header: 'Type',
    accessorKey: 'type',
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay className="justify-center">
          <Badge>{cell.getValue() as string}</Badge>
        </RecordTableCellDisplay>
      );
    },
    size: 250,
  },
];

export const TagsRecordTable = () => {
  const [queries] = useMultiQueryState<{
    contentType: string;
    searchValue: string;
  }>(['contentType', 'searchValue']);
  const { contentType, searchValue } = queries;
  const { tags, pageInfo, loading, handleFetchMore } = useTags({
    variables: {
      type: contentType || '',
      searchValue: searchValue ?? undefined,
    },
  });

  return (
    <RecordTable.Provider
      columns={tagsColumns}
      data={tags || []}
      className="m-3"
      stickyColumns={['more', 'name']}
    >
      <RecordTableTree id="product-categories" ordered>
        <RecordTable.Scroll>
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.RowList Row={RecordTableTree.Row} />
              {loading && <RecordTable.RowSkeleton rows={30} />}
              {!loading && pageInfo?.hasNextPage && (
                <RecordTable.RowSkeleton
                  rows={3}
                  handleInView={handleFetchMore}
                />
              )}
            </RecordTable.Body>
          </RecordTable>
        </RecordTable.Scroll>
      </RecordTableTree>
    </RecordTable.Provider>
  );
};
