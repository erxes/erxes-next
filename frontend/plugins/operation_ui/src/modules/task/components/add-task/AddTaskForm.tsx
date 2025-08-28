import {
  Form,
  Input,
  Sheet,
  Button,
  Separator,
  useBlockEditor,
  BlockEditor,
  cn,
} from 'erxes-ui';
import { TAddTask, addTaskSchema } from '@/task/types';
import { useCreateTask } from '@/task/hooks/useCreateTask';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Block } from '@blocknote/core';
import { SelectCycle } from '@/task/components/select/SelectCycle';
import {
  SelectStatus,
  SelectTeam,
  SelectPriority,
  SelectAssignee,
  DateSelect,
  SelectEstimatedPoint,
} from '@/task/components/select';
import { SelectProject } from '@/task/components/select/SelectProject';
import { useGetCurrentUsersTeams } from '@/team/hooks/useGetCurrentUsersTeams';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { currentUserState } from 'ui-modules';
import { useGetProject } from '@/project/hooks/useGetProject';

export const AddTaskForm = ({ onClose }: { onClose: () => void }) => {
  const { teamId, projectId, cycleId } = useParams<{
    teamId?: string;
    projectId?: string;
    cycleId?: string;
  }>();

  const { teams } = useGetCurrentUsersTeams();
  const currentUser = useAtomValue(currentUserState);
  const { createTask } = useCreateTask();
  const [descriptionContent, setDescriptionContent] = useState<Block[]>();
  const editor = useBlockEditor();

  const { project } = useGetProject({
    variables: { _id: projectId || '' },
    skip: !projectId,
  });

  const [_teamId, _setTeamId] = useState<string | undefined>(
    teamId ? teamId : project?.teamIds?.[0] ? project?.teamIds?.[0] : undefined,
  );

  const form = useForm<TAddTask>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      teamId: _teamId,
      name: '',
      status: '',
      priority: 0,
      assigneeId: teamId ? undefined : currentUser?._id,
      projectId: projectId || undefined,
      startDate: undefined,
      targetDate: undefined,
      estimatePoint: undefined,
      cycleId: cycleId,
    },
  });

  useEffect(() => {
    if (teams && teams.length > 0 && !form.getValues('teamId') && !teamId) {
      form.setValue('teamId', teams[0]._id);
      _setTeamId(teams[0]._id);
    }
  }, [teams, form, teamId, currentUser]);

  const handleDescriptionChange = async () => {
    const content = await editor?.document;
    if (content) {
      content.pop();
      setDescriptionContent(content as Block[]);
    }
  };

  const onSubmit = async (data: TAddTask) => {
    createTask({
      variables: {
        ...data,
        description: JSON.stringify(descriptionContent),
        priority: data.priority || 0,
        status: data.status || '0',
      },
      onCompleted: () => {
        onClose();
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-full flex flex-col"
      >
        <Sheet.Header className="flex items-center gap-2 ">
          <Form.Field
            name="teamId"
            control={form.control}
            render={({ field }) => (
              <Form.Item className="space-y-0">
                <Form.Label className="sr-only">Team</Form.Label>
                <SelectTeam.FormItem
                  {...field}
                  onChange={(value) => {
                    field.onChange(value);
                    form.resetField('projectId');
                  }}
                  mode="single"
                  teams={teams}
                  className={cn(
                    'm-0',
                    teamId && 'hover:bg-background cursor-default',
                  )}
                  onClick={
                    teamId
                      ? (e) => {
                          e.preventDefault();
                        }
                      : undefined
                  }
                />
              </Form.Item>
            )}
          />
          <IconChevronRight className="size-4" />
          <Sheet.Title className="">New task</Sheet.Title>
        </Sheet.Header>
        <Sheet.Content className="px-7 py-4 gap-2 flex flex-col">
          <Form.Field
            name="name"
            control={form.control}
            render={({ field }) => (
              <Form.Item>
                <Form.Label className="sr-only">Name</Form.Label>
                <Form.Control>
                  <Input
                    {...field}
                    className="shadow-none focus-visible:shadow-none h-8 text-xl"
                    placeholder="Task Name"
                  />
                </Form.Control>
              </Form.Item>
            )}
          />
          <div className="flex gap-2 w-full flex-wrap">
            <Form.Field
              name="status"
              control={form.control}
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="sr-only">Status</Form.Label>
                  <SelectStatus.FormItem
                    {...field}
                    value={field.value}
                    onChange={(value) => field.onChange(value.toString())}
                    teamId={form.getValues('teamId') || _teamId}
                  />
                </Form.Item>
              )}
            />
            <Form.Field
              name="priority"
              control={form.control}
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="sr-only">Priority</Form.Label>
                  <SelectPriority.FormItem {...field} />
                </Form.Item>
              )}
            />
            <Form.Field
              name="assigneeId"
              control={form.control}
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="sr-only">Assignee</Form.Label>
                  <SelectAssignee.FormItem
                    {...field}
                    mode="single"
                    value={field.value || ''}
                    onValueChange={(value: any) => {
                      field.onChange(value);
                    }}
                    teamIds={form.getValues('teamId') || _teamId}
                  />
                </Form.Item>
              )}
            />
            <Form.Field
              name="projectId"
              control={form.control}
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="sr-only">Project</Form.Label>
                  <SelectProject.FormItem
                    {...field}
                    mode="single"
                    value={field.value || ''}
                    onValueChange={(value: any) => {
                      field.onChange(value);
                    }}
                    teamId={form.getValues('teamId') || undefined}
                    placeholder="Project"
                  />
                </Form.Item>
              )}
            />
            <Form.Field
              name="startDate"
              control={form.control}
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="sr-only">Start Date</Form.Label>
                  <DateSelect.FormItem
                    {...field}
                    type="start"
                    placeholder="Start Date"
                  />
                </Form.Item>
              )}
            />
            <Form.Field
              name="targetDate"
              control={form.control}
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="sr-only">Target Date</Form.Label>
                  <DateSelect.FormItem
                    {...field}
                    type="target"
                    placeholder="Target Date"
                  />
                </Form.Item>
              )}
            />
            <Form.Field
              name="estimatePoint"
              control={form.control}
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="sr-only">Estimate Point</Form.Label>
                  <SelectEstimatedPoint.FormItem
                    {...field}
                    mode="single"
                    value={field.value || ''}
                    teamId={form.getValues('teamId') || _teamId}
                  />
                </Form.Item>
              )}
            />
            <Form.Field
              name="cycleId"
              control={form.control}
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="sr-only">Cycle</Form.Label>
                  <SelectCycle
                    {...field}
                    teamId={form.getValues('teamId') || _teamId}
                    value={field.value || ''}
                  />
                </Form.Item>
              )}
            />
          </div>
          <Separator className="my-4" />
          <div className="h-[60vh] overflow-y-auto">
            <BlockEditor
              editor={editor}
              onChange={handleDescriptionChange}
              className="min-h-full"
            />
          </div>
        </Sheet.Content>
        <Sheet.Footer className="flex justify-end flex-shrink-0 gap-1 px-5">
          <Button
            type="button"
            variant="ghost"
            className="bg-background hover:bg-background/90"
            onClick={() => {
              onClose();
              form.reset();
              editor?.removeBlocks(editor?.document);
              setDescriptionContent(undefined);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save
          </Button>
        </Sheet.Footer>
      </form>
    </Form>
  );
};
