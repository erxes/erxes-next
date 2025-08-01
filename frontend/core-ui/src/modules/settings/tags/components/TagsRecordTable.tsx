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
import { useTagsEdit } from '@/settings/tags/hooks/useTagsEdit';
import React from 'react';

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

export const tagsColumns: ColumnDef<
  ITag & { hasChildren: boolean; type?: string }
>[] = [
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
      const { tagsEdit, loading } = useTagsEdit();
      const { _id, name, type } = cell.row.original;
      const [open, setOpen] = React.useState<boolean>(false);
      const [_name, setName] = React.useState<string>(name);

      const onSave = () => {
        if (name !== _name) {
          tagsEdit({
            variables: {
              id: _id,
              type: type,
              name: _name,
            },
          });
        }
      };

      const onChange = (el: React.ChangeEvent<HTMLInputElement>) => {
        setName(el.currentTarget.value);
      };

      return (
        <RecordTablePopover
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            if (!open) {
              onSave();
            }
          }}
        >
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
            <Input value={_name} onChange={onChange} disabled={loading} />
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
      const { _id, name, type, parentId } = cell.row.original;
      const { tagsEdit } = useTagsEdit();
      return (
        <SelectTags.InlineCell
          scope="tag"
          mode="single"
          value={cell.getValue() as string}
          onValueChange={(value) => {
            if (value !== parentId) {
              tagsEdit({
                variables: {
                  id: _id,
                  type: type,
                  name: name,
                  parentId: value || undefined,
                },
              });
            }
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
          <Badge variant={'secondary'}>
            {(cell.getValue() as number) || 0}
          </Badge>
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
          <Badge variant={'secondary'}>
            {(cell.getValue() as number) || 0}
          </Badge>
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
      <RecordTableTree id="tags-list" ordered>
        <RecordTable.Scroll>
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.RowList Row={RecordTableTree.Row} />
              {loading && <RecordTable.RowSkeleton rows={30} />}
              {!loading && pageInfo?.hasNextPage && (
                <RecordTable.RowSkeleton
                  rows={1}
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
