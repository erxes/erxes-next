import {
  Input,
  IconPicker,
  Separator,
  useBlockEditor,
  BlockEditor,
} from 'erxes-ui';
import { useUpdateProject } from '@/project/hooks/useUpdateProject';
import { useDebounce } from 'use-debounce';
import { useEffect, useState } from 'react';
import { Block } from '@blocknote/core';
import {
  SelectStatus,
  SelectTeam,
  SelectPriority,
  SelectLead,
  DateSelect,
} from '@/project/components/select';
import { useGetProject } from '@/project/hooks/useGetProject';
import { useGetCurrentUsersTeams } from '@/team/hooks/useGetCurrentUsersTeams';

export const ProjectFields = ({ projectId }: { projectId: string }) => {
  const { project } = useGetProject({
    variables: { _id: projectId },
  });

  const {
    teamIds,
    priority,
    icon,
    status,
    leadId,
    name: _name,
    startDate,
    targetDate,
    description,
  } = project || {};
  const [descriptionContent, setDescriptionContent] = useState<
    Block[] | undefined
  >(description ? JSON.parse(description) : undefined);
  const editor = useBlockEditor({
    initialContent: descriptionContent,
  });
  const { updateProject } = useUpdateProject();
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
    updateProject({
      variables: {
        _id: projectId,
        name: debouncedName,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);
  useEffect(() => {
    if (
      !debouncedDescriptionContent ||
      debouncedDescriptionContent === descriptionContent
    )
      return;
    updateProject({
      variables: {
        _id: projectId,
        description: JSON.stringify(debouncedDescriptionContent),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDescriptionContent]);
  return (
    <div className="flex flex-col gap-3">
      <IconPicker
        variant="secondary"
        size="icon"
        className="w-min p-2"
        value={icon}
        onValueChange={(_icon) => {
          if (_icon !== icon) {
            updateProject({ variables: { _id: projectId, icon: _icon } });
          }
        }}
      />
      <Input
        className="shadow-none focus-visible:shadow-none h-8 text-xl p-0"
        placeholder="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="gap-2 flex flex-wrap w-full">
        <SelectStatus.Detail value={status} id={projectId} />
        <SelectPriority.Detail value={priority} id={projectId} />
        <SelectLead.Detail value={leadId} id={projectId} />
        <DateSelect.Detail value={startDate} id={projectId} type="start" />
        <DateSelect.Detail value={targetDate} id={projectId} type="target" />
        <SelectTeam.Detail
          mode="multiple"
          value={teamIds}
          id={projectId}
          teams={teams}
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
    </div>
  );
};
