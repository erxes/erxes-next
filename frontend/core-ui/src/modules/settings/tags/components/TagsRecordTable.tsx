import { Cell, ColumnDef } from '@tanstack/react-table';
import {
  RecordTable,
  RecordTableTree,
  TextField,
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
        <TextField
          scope="tag"
          value={cell.getValue() as string}
          onValueChange={(value) => {
            console.log(value);
          }}
        >
          <RecordTableTree.Trigger
            order={cell.row.original.order}
            name={cell.getValue() as string}
            hasChildren={cell.row.original.hasChildren}
          />
        </TextField>
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
      return <div>{cell.getValue() as number}</div>;
    },
  },
];

export const TagsRecordTable = () => {
  const [searchValue] = useQueryState('searchValue');
  const { tags, pageInfo, loading, handleFetchMore, sortedTags } = useTags({
    variables: {
      type: 'core:customer',
      searchValue: searchValue ?? undefined,
    },
  });

  return (
    <RecordTable.Provider
      columns={tagsColumns}
      data={sortedTags || []}
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
