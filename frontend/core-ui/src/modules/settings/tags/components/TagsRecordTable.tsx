import { Cell, ColumnDef } from '@tanstack/react-table';
import {
  Input,
  RecordTable,
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTablePopover,
  RecordTableTree,
  useQueryState,
} from 'erxes-ui';
import { ITag, SelectTags, useTags } from 'ui-modules';

export const TagMoreColumnCell = ({
  cell,
}: {
  cell: Cell<ITag & { hasChildren: boolean }, unknown>;
}) => {
  const [, setOpen] = useQueryState('tagId');

  return (
    <RecordTable.MoreButton
      className="w-full h-full"
      onClick={() => {
        setOpen(cell.row.original._id);
      }}
    />
  );
};

export const tagsColumns: ColumnDef<ITag & { hasChildren: boolean }>[] = [
  {
    id: 'more',
    cell: TagMoreColumnCell,
    size: 33,
  },
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ cell }) => {
      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <RecordTableTree.Trigger
              order={cell.row.original.order}
              name={cell.row.original.name}
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
      return <div>{cell.getValue() as number}</div>;
    },
  },
];

export const TagsRecordTable = () => {
  const { tags, pageInfo, loading, handleFetchMore } = useTags({
    variables: {
      type: 'core:customer',
    },
  });

  return (
    <RecordTable.Provider
      columns={tagsColumns}
      data={tags || []}
      className="m-3"
    >
      <RecordTableTree id="product-categories" ordered>
        <RecordTable.Scroll>
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.RowList />
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
