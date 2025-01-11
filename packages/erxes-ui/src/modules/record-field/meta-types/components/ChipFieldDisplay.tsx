import { Skeleton } from 'erxes-ui/components';
import { ChipDisplay } from 'erxes-ui/components/display/ChipDisplay';
import { useRecordTable } from 'erxes-ui/modules/record-table/components/RecordTableProvider';
import { useRecordTableCellContext } from 'erxes-ui/modules/record-table/record-table-cell/contexts/RecordTableCellContext';

export const ChipFieldDisplay = () => {
  const { value, column } = useRecordTableCellContext();
  const { getFetchValueHook } = useRecordTable();
  const { options, loading } = getFetchValueHook(column.id)();

  if (loading) {
    return <Skeleton className="h-4 w-24" />;
  }

  const chipValue = options?.find((option) => option._id === value);

  return (
    <ChipDisplay attachment={chipValue?.attachment} colorSeed={chipValue?._id}>
      {chipValue?.name}
    </ChipDisplay>
  );
};
