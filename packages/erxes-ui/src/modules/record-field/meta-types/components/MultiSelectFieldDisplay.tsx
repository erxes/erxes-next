import { Badge, Skeleton } from 'erxes-ui/components';
import { useRecordTable } from 'erxes-ui/modules/record-table/components/RecordTableProvider';
import { useRecordTableCellContext } from 'erxes-ui/modules/record-table/record-table-cell/contexts/RecordTableCellContext';

export const MultiSelectFieldDisplay = () => {
  const { value, column } = useRecordTableCellContext();
  const { getFetchValueHook } = useRecordTable();
  const { options, loading } = getFetchValueHook(column.id)();

  if (loading) return <Skeleton className="h-3 w-full" />;

  return (
    <div className="flex items-center gap-1 px-2">
      {value?.map((tagId) => {
        const tagName = options?.find((t) => t._id === tagId)?.name;

        return (
          <Badge color="crimson" key={tagId}>
            {tagName || tagId}
          </Badge>
        );
      })}
    </div>
  );
};
