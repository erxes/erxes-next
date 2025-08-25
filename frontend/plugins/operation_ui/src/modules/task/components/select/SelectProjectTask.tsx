import {
  Combobox,
  Command,
  Filter,
  useFilterContext,
  useQueryState,
  PopoverScoped,
} from 'erxes-ui';
import { useProjects } from '@/project/hooks/useGetProjects';
import { IProject } from '@/project/types';
import React, { useState } from 'react';
import {
  SelectProjectContext,
  useSelectProjectContext,
} from '@/project/contexts/SelectProjectContext';
import { IconClipboard } from '@tabler/icons-react';
import { useParams } from 'react-router-dom';
import {
  SelectOperationContent,
  SelectTriggerOperation,
  SelectTriggerVariant,
} from '@/operation/components/SelectOperation';
import { useUpdateTask } from '@/task/hooks/useUpdateTask';

export const SelectProjectProvider = ({
  children,
  value,
  onValueChange,
  teamId,
}: {
  children: React.ReactNode;
  value?: string;
  onValueChange: (value: string) => void;
  teamId?: string;
}) => {
  const { teamId: _teamId } = useParams();

  const { projects, handleFetchMore, totalCount } = useProjects({
    variables: {
      teamIds: [teamId || _teamId],
    },
  });

  const handleValueChange = (value: string) => {
    if (!value) return;
    onValueChange(value);
  };

  return (
    <SelectProjectContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        projects: projects || [],
        handleFetchMore,
        totalCount,
      }}
    >
      {children}
    </SelectProjectContext.Provider>
  );
};

const SelectProjectValue = ({ placeholder }: { placeholder?: string }) => {
  const { projects, value } = useSelectProjectContext();
  if (!value)
    return (
      <div className="flex items-center gap-2 text-accent-foreground">
        <IconClipboard className="size-4" />
        <span className="truncate font-medium">
          {placeholder || 'Select project'}
        </span>
      </div>
    );

  return (
    <div className="flex items-center gap-2">
      <IconClipboard className="size-4" />
      <span className="truncate font-medium">
        {projects.find((p) => p._id === value)?.name}
      </span>
    </div>
  );
};

const SelectProjectCommandItem = ({ project }: { project: IProject }) => {
  const { onValueChange, value } = useSelectProjectContext();

  return (
    <Command.Item
      value={project._id}
      onSelect={() => onValueChange(project._id)}
    >
      <div className="flex items-center gap-2">
        <IconClipboard className="h-4 w-4" />
        <span className="truncate font-medium">{project.name}</span>
      </div>
      <Combobox.Check checked={value === project._id} />
    </Command.Item>
  );
};

const SelectProjectContent = () => {
  const { projects, handleFetchMore, totalCount } = useSelectProjectContext();

  return (
    <Command id="project-command-menu">
      <Command.Input placeholder="Search project" />
      <Command.Empty>No project found</Command.Empty>
      <Command.List>
        {projects.map((project) => (
          <SelectProjectCommandItem key={project._id} project={project} />
        ))}
        <Combobox.FetchMore
          fetchMore={handleFetchMore}
          totalCount={totalCount || 0}
          currentLength={projects.length}
        />
      </Command.List>
    </Command>
  );
};

export const SelectProjectFilterView = () => {
  const [project, setProject] = useQueryState<string>('project');
  const { resetFilterState } = useFilterContext();

  return (
    <Filter.View filterKey={'project'}>
      <SelectProjectProvider
        value={project || ''}
        onValueChange={(value: string) => {
          setProject(value);
          resetFilterState();
        }}
      >
        <SelectProjectContent />
      </SelectProjectProvider>
    </Filter.View>
  );
};

export const SelectProjectFormItem = ({
  onValueChange,
  teamId,
  scope,
  value,
}: {
  teamId?: string;
  scope?: string;
  onValueChange: (value: string) => void;
  value?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <SelectProjectProvider
      value={value}
      onValueChange={(value: string) => {
        onValueChange(value);
        setOpen(false);
      }}
      teamId={teamId}
    >
      <PopoverScoped open={open} onOpenChange={setOpen} scope={scope}>
        <SelectTriggerOperation variant="form">
          <SelectProjectValue />
        </SelectTriggerOperation>
        <SelectOperationContent variant="form">
          <SelectProjectContent />
        </SelectOperationContent>
      </PopoverScoped>
    </SelectProjectProvider>
  );
};

const SelectProjectRoot = ({
  taskId,
  value,
  scope,
  variant,
}: {
  taskId: string;
  value: string;
  scope?: string;
  variant: `${SelectTriggerVariant}`;
}) => {
  const [open, setOpen] = useState(false);
  const { updateTask } = useUpdateTask();

  return (
    <SelectProjectProvider
      onValueChange={(value) => {
        updateTask({
          variables: {
            _id: taskId,
            projectIds: value,
          },
        });
        setOpen(false);
      }}
      value={value}
    >
      <PopoverScoped open={open} onOpenChange={setOpen} scope={scope}>
        <SelectTriggerOperation variant={variant}>
          <SelectProjectValue />
        </SelectTriggerOperation>
        <SelectOperationContent variant={variant}>
          <SelectProjectContent />
        </SelectOperationContent>
      </PopoverScoped>
    </SelectProjectProvider>
  );
};

export const SelectProjectFilterBar = () => {
  const [project, setProject] = useQueryState<string>('project');
  const [open, setOpen] = useState(false);
  return (
    <SelectProjectProvider
      value={project || ''}
      onValueChange={(value: string) => {
        setProject(value);
        setOpen(false);
      }}
    >
      <PopoverScoped open={open} onOpenChange={setOpen}>
        <SelectTriggerOperation variant="filter">
          <SelectProjectValue />
        </SelectTriggerOperation>
        <SelectOperationContent variant="filter">
          <SelectProjectContent />
        </SelectOperationContent>
      </PopoverScoped>
    </SelectProjectProvider>
  );
};

export const SelectProject = Object.assign(SelectProjectRoot, {
  FilterView: SelectProjectFilterView,
  FilterBar: SelectProjectFilterBar,
  FormItem: SelectProjectFormItem,
});
