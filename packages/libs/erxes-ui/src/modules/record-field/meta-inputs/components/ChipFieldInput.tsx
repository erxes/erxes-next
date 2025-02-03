import { IconCheck } from '@tabler/icons-react';
import { Avatar, Command } from 'erxes-ui/components';
import { ChipDisplay } from 'erxes-ui/components/display/ChipDisplay';
import { cn } from 'erxes-ui/lib/utils';

export const ChipFieldInput = ({
  value,
  options,
  onSelect,
}: {
  value: any;
  options: any[];
  onSelect: (value: any) => void;
}) => {
  return (
    <>
      <div className="h-cell border border-primary ring-[3px] ring-ring/20 relative z-10 flex items-center gap-2 p-2">
        <ChipDisplay attachment={value?.attachment} colorSeed={value?._id}>
          {value?.name}
        </ChipDisplay>
      </div>
      <Command>
        <Command.Input variant="secondary" />
        <Command.List className="styled-scroll overflow-x-auto">
          {options?.map((option) => (
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
          <Command.Empty>No options found</Command.Empty>
        </Command.List>
      </Command>
    </>
  );
};
