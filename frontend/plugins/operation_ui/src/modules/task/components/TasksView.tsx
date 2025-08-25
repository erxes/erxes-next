import { Button, Popover, PopoverScoped, ToggleGroup } from 'erxes-ui';
import {
  IconAdjustmentsHorizontal,
  IconLayoutKanban,
  IconTable,
} from '@tabler/icons-react';
import { useAtom, useAtomValue } from 'jotai';
import { tasksViewAtom } from '@/task/states/tasksViewState';
import { lazy, Suspense } from 'react';
import { TaskDetailSheet } from '@/task/components/TaskDetailSheet';

const TasksRecordTable = lazy(() =>
  import('@/task/components/TasksRecordTable').then((mod) => ({
    default: mod.TasksRecordTable,
  })),
);

const TasksBoard = lazy(() =>
  import('@/task/components/TasksBoard').then((mod) => ({
    default: mod.TasksBoardNew,
  })),
);

export const TasksViewControl = () => {
  const [view, setView] = useAtom(tasksViewAtom);

  return (
    <PopoverScoped>
      <Popover.Trigger asChild>
        <Button variant="ghost">
          <IconAdjustmentsHorizontal />
          View
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <ToggleGroup
          type="single"
          defaultValue="list"
          className="grid grid-cols-2 gap-2"
          value={view}
          onValueChange={(value) => setView(value as 'list' | 'grid')}
        >
          <ToggleGroup.Item value="list" asChild>
            <Button
              variant="secondary"
              size="lg"
              className="h-11 flex-col gap-0"
            >
              <IconTable className="!size-5" />
              <span className="text-xs font-normal">List</span>
            </Button>
          </ToggleGroup.Item>
          <ToggleGroup.Item value="grid" asChild>
            <Button
              variant="secondary"
              size="lg"
              className="h-11 flex-col gap-0"
            >
              <IconLayoutKanban className="!size-5" />
              <span className="text-xs font-normal">Board</span>
            </Button>
          </ToggleGroup.Item>
        </ToggleGroup>
      </Popover.Content>
    </PopoverScoped>
  );
};

export const TasksView = () => {
  const view = useAtomValue(tasksViewAtom);

  return (
    <Suspense>
      {view === 'list' && <TasksRecordTable />}
      {view === 'grid' && <TasksBoard />}
      <TaskDetailSheet />
    </Suspense>
  );
};
