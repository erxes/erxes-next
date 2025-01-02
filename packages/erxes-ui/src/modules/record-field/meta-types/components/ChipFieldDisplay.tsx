import { Avatar, Button, Skeleton } from 'erxes-ui/components';
import { useRecordTable } from 'erxes-ui/modules/record-table/components/RecordTableProvider';
import { useRecordTableCellContext } from 'erxes-ui/modules/record-table/record-table-cell/contexts/RecordTableCellContext';

export const ChipFieldDisplay = () => {
  const { getValue, column } = useRecordTableCellContext();
  const { getFetchValueHook } = useRecordTable();
  const { options, loading } = getFetchValueHook(column.id)();

  if (loading) {
    return <Skeleton className="h-4 w-24" />;
  }

  const chipValue = options?.find((option) => option._id === getValue());

  console.log(chipValue, getValue(), getValue);

  return (
    <Button
      variant="secondary"
      size="sm"
      asChild
      className="truncate justify-start"
    >
      <div>
        <Avatar.Root>
          <Avatar.Image src={chipValue?.attachment?.url} />
          <Avatar.Fallback colorSeed={chipValue?._id}>
            {chipValue?.name?.charAt(0)}
          </Avatar.Fallback>
        </Avatar.Root>
        {chipValue?.name}
      </div>
    </Button>
  );
};
