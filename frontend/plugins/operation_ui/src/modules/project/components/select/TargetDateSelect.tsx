import { ProjectHotKeyScope } from '@/project/types';
import { format, differenceInDays } from 'date-fns';
import { useUpdateProject } from '@/project/hooks/useUpdateProject';
import {
  Calendar,
  RecordTablePopover,
  RecordTableCellTrigger,
  RecordTableCellContent,
} from 'erxes-ui';
import { useState } from 'react';
import { IconCalendarTime } from '@tabler/icons-react';

interface TargetDateSelectProps {
  value?: Date;
  id: string;
}

const getDateColorClass = (targetDate: Date): string => {
  const today = new Date();
  const daysUntilTarget = differenceInDays(targetDate, today);

  if (daysUntilTarget < 0) {
    return 'text-red-500';
  } else if (daysUntilTarget <= 3) {
    return 'text-amber-500';
  } else if (daysUntilTarget <= 7) {
    return 'text-yellow-500';
  } else if (daysUntilTarget <= 14) {
    return 'text-blue-500';
  } else {
    return 'text-green-500';
  }
};

export const TargetDateSelect = ({ value, id }: TargetDateSelectProps) => {
  const { updateProject } = useUpdateProject();
  const [open, setOpen] = useState(false);
  return (
    <RecordTablePopover
      scope={ProjectHotKeyScope.ProjectTableCell + '.' + id + '.TargetDate'}
      closeOnEnter
      open={open}
      onOpenChange={setOpen}
    >
      <RecordTableCellTrigger>
        {value ? (
          <span className="flex items-center justify-center gap-2">
            <IconCalendarTime
              className={`size-4 ${getDateColorClass(value)}`}
            />
            {format(value, 'MMM d, yyyy')}
          </span>
        ) : (
          <span className="text-accent-foreground">not specified</span>
        )}
      </RecordTableCellTrigger>
      <RecordTableCellContent className="w-fit">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(newValue) => {
            if (newValue !== value) {
              updateProject({
                variables: {
                  _id: id,
                  targetDate: newValue?.toISOString(),
                },
              });
            }
            setOpen(false);
          }}
          defaultMonth={value}
        />
      </RecordTableCellContent>
    </RecordTablePopover>
  );
};
