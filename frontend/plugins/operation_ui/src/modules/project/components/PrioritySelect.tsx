import { Badge, cn, Command } from 'erxes-ui';
import { PROJECT_PRIORITIES_OPTIONS } from '@/project/constants';
import {
  RecordTablePopover,
  RecordTableCellTrigger,
  RecordTableCellContent,
} from 'erxes-ui';
import { ProjectHotKeyScope } from '@/project/ProjectHotKeyScope';
import { useState } from 'react';
import { IconCheck } from '@tabler/icons-react';
import { useUpdateProject } from '@/project/hooks/useUpdateProject';

interface PrioritySelectProps {
  value: number;
  id: string;
}

export const PrioritySelect = ({ value, id }: PrioritySelectProps) => {
  const [open, setOpen] = useState(false);
  const { updateProject } = useUpdateProject();
  const [selectedValue, setSelectedValue] = useState(value.toString());
  const onValueChange = (value: string) => {
    updateProject({
      variables: {
        _id: id,
        priority: Number(value),
      },
    });
  };
  const selectedPriority = PROJECT_PRIORITIES_OPTIONS.find(
    (option) => option.value === Number(selectedValue),
  );

  return (
    <RecordTablePopover
      scope={ProjectHotKeyScope.ProjectTableCell + '.' + id + '.Priority'}
      closeOnEnter
      open={open}
      onOpenChange={setOpen}
    >
      <RecordTableCellTrigger>
        <Badge
          variant="secondary"
          style={
            selectedPriority?.value !== 0
              ? { backgroundColor: `${selectedPriority?.IconColor}25` }
              : undefined
          }
        >
          {selectedPriority && selectedPriority.value !== 0 && (
            <selectedPriority.Icon
              className="w-4 h-4"
              color={selectedPriority.IconColor}
              stroke={2}
            />
          )}
          {selectedPriority?.name}
        </Badge>
      </RecordTableCellTrigger>
      <RecordTableCellContent className="max-w-72">
        <Command>
          <Command.List>
            {PROJECT_PRIORITIES_OPTIONS.map((option) => (
              <Command.Item
                key={option.value}
                value={option.value.toString()}
                className="text-base font-medium justify-between"
                onSelect={() => {
                  setSelectedValue(option.value.toString());
                  setOpen(false);
                  onValueChange(option.value.toString());
                }}
              >
                <span className="flex items-center gap-2">
                  <option.Icon
                    className="w-4 h-4"
                    color={option.IconColor}
                    stroke={1.8}
                  />
                  {option.name}
                </span>
                <IconCheck
                  className={cn(
                    'w-4 h-4 text-primary',
                    selectedValue === option.value.toString()
                      ? 'visible'
                      : 'invisible',
                  )}
                />
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </RecordTableCellContent>
    </RecordTablePopover>
  );
};
