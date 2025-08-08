import {
  Form,
  Input,
  Sheet,
  IconPicker,
  Button,
  Separator,
  useBlockEditor,
  BlockEditor,
} from 'erxes-ui';
import { TAddProject, addProjectSchema } from '@/project/types';
import { useCreateProject } from '@/project/hooks/useCreateProject';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Block } from '@blocknote/core';
import {
  SelectStatus,
  SelectTeam,
  SelectPriority,
  SelectLead,
  DateSelect,
} from '@/project/components/select';
import { useGetCurrentUsersTeams } from '@/team/hooks/useGetCurrentUsersTeams';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams } from 'react-router-dom';

export const AddProjectForm = ({ onClose }: { onClose: () => void }) => {
  const { teamId } = useParams();
  const { createProject } = useCreateProject();
  const { teams } = useGetCurrentUsersTeams({});

  const editor = useBlockEditor();
  const [descriptionContent, setDescriptionContent] = useState<Block[]>();
  const form = useForm<TAddProject>({
    resolver: zodResolver(addProjectSchema),
    defaultValues: {
      teamIds: [teamId],
      icon: 'IconBox',
      name: '',
      status: 0,
      priority: 0,
      leadId: undefined,
      targetDate: undefined,
    },
  });

  useEffect(() => {
    if (teams && teams.length > 0 && !form.getValues('teamIds').length) {
      form.setValue('teamIds', [teams[0]._id]);
    }
  }, [teams, form]);

  const handleDescriptionChange = async () => {
    const content = await editor?.document;
    if (content) {
      content.pop();
      setDescriptionContent(content as Block[]);
    }
  };

  const onSubmit = async (data: TAddProject) => {
    let descriptionHtml = '';
    if (descriptionContent && descriptionContent.length > 0) {
      descriptionHtml =
        (await editor?.blocksToHTMLLossy(descriptionContent)) || '';
    }

    createProject({
      variables: {
        ...data,
        description: descriptionHtml,
      },
    });
    onClose();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-full flex flex-col"
      >
        <Sheet.Header className="flex items-center gap-2 ">
          <Form.Field
            name="teamIds"
            control={form.control}
            render={({ field }) => (
              <Form.Item className="space-y-0">
                <Form.Label className="sr-only">Team</Form.Label>
                <SelectTeam.FormItem {...field} teams={teams} className="m-0" />
              </Form.Item>
            )}
          />
          <IconChevronRight className="size-4" />
          <Sheet.Title className="">New project</Sheet.Title>
        </Sheet.Header>
        <Sheet.Content className="px-7 py-4 gap-2 flex flex-col">
          <Form.Field
            control={form.control}
            name="icon"
            render={({ field }) => (
              <Form.Item>
                <Form.Label className="sr-only">Icon</Form.Label>
                <Form.Control>
                  <IconPicker
                    onValueChange={field.onChange}
                    value={field.value}
                    variant="secondary"
                    size="icon"
                    className="w-min p-2"
                  />
                </Form.Control>
              </Form.Item>
            )}
          />
          <Form.Field
            name="name"
            control={form.control}
            render={({ field }) => (
              <Form.Item>
                <Form.Label className="sr-only">Name</Form.Label>
                <Form.Control>
                  <Input
                    {...field}
                    className="shadow-none focus-visible:shadow-none h-8 text-2xl"
                    placeholder="Project Name"
                  />
                </Form.Control>
              </Form.Item>
            )}
          />
          <div className="flex gap-2">
            <Form.Field
              name="status"
              control={form.control}
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="sr-only">Status</Form.Label>
                  <SelectStatus.FormItem {...field} />
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
              name="leadId"
              control={form.control}
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="sr-only">Lead</Form.Label>
                  <SelectLead.FormItem
                    {...field}
                    value={field.value}
                    onValueChange={(value: any) => {
                      field.onChange(value);
                    }}
                    teamIds={form.getValues('teamIds')}
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
          </div>
          <Separator className="my-4" />
          <div className="h-full">
            <BlockEditor
              editor={editor}
              onChange={handleDescriptionChange}
              className="h-full text-xl"
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
