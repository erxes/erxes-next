import { IconCheck } from '@tabler/icons-react';
import { Avatar, Command, Skeleton } from 'erxes-ui/components';
import { ChipDisplay } from 'erxes-ui/components/display/ChipDisplay';
import { cn } from 'erxes-ui/lib/utils';
import { useRecordTable } from 'erxes-ui/modules/record-table/components/RecordTableProvider';
import { useRecordTableCellContext } from 'erxes-ui/modules/record-table/record-table-cell/contexts/RecordTableCellContext';

export const ChipFieldInput = () => {
  const { column, value, onSelect } = useRecordTableCellContext();
  const { getFetchValueHook } = useRecordTable();
  const { options, loading } = getFetchValueHook(column.id)();

  if (loading) {
    return <Skeleton className="h-4 w-24" />;
  }

  const chipValue = options?.find((option) => option._id === value);

  const sortedOptions = [chipValue].concat(
    options?.filter((option) => option._id !== chipValue?._id)
  );
  return (
    <>
      <div className="h-cell border border-primary ring-[3px] ring-ring/20 relative z-10 flex items-center gap-2 p-2">
        <ChipDisplay
          attachment={chipValue?.attachment}
          colorSeed={chipValue?._id}
        >
          {chipValue?.name}
        </ChipDisplay>
      </div>
      <Command>
        <Command.Input variant="secondary" />
        <Command.List className="styled-scroll overflow-x-auto">
          {sortedOptions?.map((option) => (
            <Command.Item
              key={option._id}
              value={option.name}
              onSelect={() => onSelect(option._id)}
            >
              <Avatar.Root>
                <Avatar.Image src={option?.attachment?.url} />
                <Avatar.Fallback colorSeed={option?._id}>
                  {option?.name?.charAt(0)}
                </Avatar.Fallback>
              </Avatar.Root>
              {option.name}
              <IconCheck
                className={cn(
                  'ml-auto',
                  option._id === value ? 'opacity-100' : 'opacity-0'
                )}
              />
            </Command.Item>
          ))}
          <Command.Empty>No {column.id} found</Command.Empty>
        </Command.List>
      </Command>
    </>
  );
};
