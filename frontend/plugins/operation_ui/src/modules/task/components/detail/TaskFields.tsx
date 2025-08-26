import { Input, Separator, useBlockEditor, BlockEditor } from 'erxes-ui';
import { useUpdateTask } from '@/task/hooks/useUpdateTask';
import { useDebounce } from 'use-debounce';
import { useEffect, useState } from 'react';
import { Block } from '@blocknote/core';
import {
  SelectStatus,
  SelectTeam,
  SelectAssignee,
  DateSelect,
  SelectProject,
  SelectEstimatedPoint,
} from '@/task/components/select';
import { useGetCurrentUsersTeams } from '@/team/hooks/useGetCurrentUsersTeams';
import { ITask } from '@/task/types';
import { ActivityList } from '@/activity/components/ActivityList';
import { SelectTaskPriority } from '@/task/components/select/SelectTaskPriority';

export const TaskFields = ({ task }: { task: ITask }) => {
  const {
    _id: taskId,
    teamId,
    priority,
    status,
    assigneeId,
    name: _name,
    targetDate,
    projectId,
    estimatePoint,
  } = task || {};

  const startDate = (task as any)?.startDate;
  const description = (task as any)?.description;

  const [descriptionContent, setDescriptionContent] = useState<
    Block[] | undefined
  >(description ? JSON.parse(description) : undefined);
  const editor = useBlockEditor({
    initialContent: descriptionContent,
    placeholder: 'Description...',
  });
  const { updateTask } = useUpdateTask();
  const [name, setName] = useState(_name);
  const { teams } = useGetCurrentUsersTeams();

  const handleDescriptionChange = async () => {
    const content = await editor?.document;
    if (content) {
      content.pop();
      setDescriptionContent(content as Block[]);
    }
  };

  const [debouncedDescriptionContent] = useDebounce(descriptionContent, 1000);
  const [debouncedName] = useDebounce(name, 1000);

  useEffect(() => {
    if (!debouncedName || debouncedName === _name) return;
    updateTask({
      variables: {
        _id: taskId,
        name: debouncedName,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);
  useEffect(() => {
    if (!debouncedDescriptionContent) return;
    if (
      JSON.stringify(debouncedDescriptionContent) ===
      JSON.stringify(description ? JSON.parse(description) : undefined)
    ) {
      return;
    }
    updateTask({
      variables: {
        _id: taskId,
        description: JSON.stringify(debouncedDescriptionContent),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDescriptionContent]);
  return (
    <div className="flex flex-col gap-3">
      <Input
        className="shadow-none focus-visible:shadow-none h-8 text-xl p-0"
        placeholder="Task Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="gap-2 flex flex-wrap w-full">
        <SelectStatus.Detail
          value={status}
          id={taskId}
          teamId={teamId || undefined}
        />
        <SelectTaskPriority taskId={taskId} value={priority} />
        <SelectAssignee.Detail
          value={assigneeId}
          id={taskId}
          teamIds={teamId ? [teamId] : undefined}
        />
        <DateSelect.Detail
          value={startDate ? new Date(startDate) : undefined}
          id={taskId}
          type="start"
        />
        <DateSelect.Detail
          value={targetDate ? new Date(targetDate) : undefined}
          id={taskId}
          type="target"
        />
        <SelectTeam.Detail value={teamId} id={taskId} teams={teams} />
        <SelectProject.Detail value={projectId} id={taskId} />
        <SelectEstimatedPoint.Detail
          value={estimatePoint}
          id={taskId}
          teamId={teamId}
        />
      </div>
      <Separator className="my-4" />
      <div className="min-h-56 overflow-y-auto">
        <BlockEditor
          editor={editor}
          onChange={handleDescriptionChange}
          className="min-h-full read-only"
        />
      </div>
      <ActivityList contentId={taskId} contentDetail={task} />
    </div>
  );
};
