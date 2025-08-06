import { Badge, cn, Command } from 'erxes-ui';
import { PROJECT_STATUS_OPTIONS } from '@/project/constants';
import {
  RecordTablePopover,
  RecordTableCellTrigger,
  RecordTableCellContent,
} from 'erxes-ui';
import { ProjectHotKeyScope } from '@/project/ProjectHotKeyScope';
import { useState } from 'react';
import { IconCheck } from '@tabler/icons-react';
import { useUpdateProject } from '@/project/hooks/useUpdateProject';

interface StatusSelectProps {
  value: number;
  id: string;
}

export const StatusSelect = ({ value, id }: StatusSelectProps) => {
  const [open, setOpen] = useState(false);
  const { updateProject } = useUpdateProject();
  const [selectedValue, setSelectedValue] = useState(value.toString());

  const onValueChange = (value: string) => {
    updateProject({
      variables: {
        _id: id,
        status: Number(value),
      },
    });
  };

  const selectedStatus = PROJECT_STATUS_OPTIONS.find(
    (option) => option.value === Number(selectedValue),
  );

  return (
    <RecordTablePopover
      scope={ProjectHotKeyScope.ProjectTableCell + '.' + id + '.Status'}
      closeOnEnter
      open={open}
      onOpenChange={setOpen}
    >
      <RecordTableCellTrigger className="justify-center">
        <Badge
          variant="secondary"
          style={{ backgroundColor: `${selectedStatus?.IconColor}25` }}
        >
          {selectedStatus && (
            <selectedStatus.Icon
              className="w-4 h-4"
              color={selectedStatus.IconColor}
              stroke={2}
            />
          )}
          {selectedStatus?.name}
        </Badge>
      </RecordTableCellTrigger>
      <RecordTableCellContent className="max-w-72">
        <Command>
          <Command.List>
            {PROJECT_STATUS_OPTIONS.map((option) => (
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
