import { BoardCardProps, Separator } from 'erxes-ui';
import {
  IconCalendarClock,
  IconCalendarEventFilled,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { Button, CalendarNew, Popover } from 'erxes-ui';
import { SelectStatusTask } from '@/task/components/select/SelectStatusTask';
import { SelectTaskPriority } from '@/task/components/select/SelectTaskPriority';
import { atom, useAtomValue } from 'jotai';
import { SelectProject } from '@/task/components/select/SelectProjectTask';
import { SelectAssigneeTask } from '@/task/components/select/SelectAssigneeTask';
import { SelectTeamTask } from '@/task/components/select/SelectTeamTask';
import { DateSelectTask } from '@/task/components/select/DateSelectTask';
import { SelectEstimatedPoint } from '@/task/components/select/SelectEstimatedPointTask';
import { allTasksMapState } from '@/task/components/TasksBoard';

export const taskBoardItemAtom = atom(
  (get) => (id: string) => get(allTasksMapState)[id],
);

export const TaskBoardCard = ({ id, column }: BoardCardProps) => {
  const {
    startDate,
    targetDate,
    name,
    number,
    priority,
    teamId,
    assigneeId,
    projectId,
    estimatePoint,
    _id,
    createdAt,
  } = useAtomValue(taskBoardItemAtom)(id);

  return (
    <div>
      <div className="flex items-center justify-between h-9 px-1.5">
        <DateSelectTask
          value={startDate}
          id={_id}
          type="startDate"
          variant="card"
        />
        <DateSelectTask
          value={targetDate}
          id={_id}
          type="targetDate"
          variant="card"
        />
      </div>
      <Separator />
      <div className="p-3 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h5 className="font-semibold">{name}</h5>
          <div className="text-accent-foreground uppercase">Task #{number}</div>
        </div>
        <div className="flex flex-wrap gap-1">
          <SelectStatusTask
            variant="card"
            value={column}
            id={_id}
            teamId={teamId}
          />
          <SelectTaskPriority taskId={_id} value={priority} variant="card" />
          <SelectTeamTask variant="card" taskId={_id} value={teamId} />
          <SelectProject value={projectId} taskId={_id} variant="card" />
          <SelectEstimatedPoint
            taskId={_id}
            value={estimatePoint}
            teamId={teamId}
            variant="card"
          />
        </div>
      </div>
      <Separator />
      <div className="h-9 flex items-center justify-between px-1.5">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground px-1 hover:bg-background"
        >
          <IconCalendarEventFilled />
          {createdAt && format(new Date(createdAt), 'MMM dd, yyyy')}
        </Button>
        <SelectAssigneeTask
          variant="card"
          value={assigneeId}
          id={_id}
          teamIds={teamId ? [teamId] : undefined}
        />
      </div>
    </div>
  );
};

export const KanbanDatePicker = ({
  date,
  onChange,
}: {
  date: Date;
  onChange: (date: Date) => void;
}) => {
  return (
    <Popover>
      <Popover.Trigger>
        <Button
          variant="ghost"
          className="text-muted-foreground font-semibold px-1"
          size="sm"
        >
          <IconCalendarClock />
          {format(date, 'MMM dd')}
        </Button>
      </Popover.Trigger>
      <Popover.Content className="p-0 max-w-none w-auto overflow-hidden">
        <CalendarNew
          mode="single"
          selected={date}
          onSelect={(date) => onChange(date as Date)}
        />
      </Popover.Content>
    </Popover>
  );
};
