import {
  cn,
  Combobox,
  Command,
  Filter,
  Form,
  Popover,
  RecordTableInlineCell,
  useFilterContext,
  useQueryState,
  EnumCursorDirection,
  Badge,
  Button,
  PopoverScoped,
} from 'erxes-ui';
import { useProjects } from '@/project/hooks/useGetProjects';
import { useGetProject } from '@/project/hooks/useGetProject';
import { IProject } from '@/project/types';
import React, { useEffect, useState } from 'react';
import {
  SelectProjectContext,
  useSelectProjectContext,
} from '@/project/contexts/SelectProjectContext';
import { IconClipboard } from '@tabler/icons-react';
import { useParams } from 'react-router-dom';
import { useUpdateTask } from '@/task/hooks/useUpdateTask';

interface ProjectsInlineProps {
  projectIds?: string[];
  projects?: IProject[];
  updateProjects?: React.Dispatch<React.SetStateAction<IProject[]>>;
  placeholder?: string;
  className?: string;
}

const ProjectsInlineEffectComponent = ({
  projectId,
  updateProjects,
  projects,
}: {
  projectId: string;
  updateProjects?: React.Dispatch<React.SetStateAction<IProject[]>>;
  projects?: IProject[];
}) => {
  const { project } = useGetProject({ variables: { _id: projectId } });

  useEffect(() => {
    const newProjects = [...(projects || [])].filter(
      (p) => p._id !== projectId,
    );

    if (project) {
      updateProjects?.([...newProjects, project]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  return null;
};

const ProjectsInline: React.FC<ProjectsInlineProps> = ({
  projectIds = [],
  projects = [],
  updateProjects,
  placeholder = 'Select project',
  className,
}) => {
  const displayProjects = projects.filter((project) =>
    projectIds.includes(project._id),
  );

  if (projectIds.length === 0) {
    return (
      <div
        className={cn('text-muted-foreground text-base font-medium', className)}
      >
        {placeholder}
      </div>
    );
  }

  if (projectIds.length === 1) {
    const project = projects.find((p) => p._id === projectIds[0]);
    return (
      <>
        <div className={cn('flex items-center gap-2', className)}>
          <IconClipboard className="size-4 text-accent-foreground" />
          <span className="truncate font-medium">{project?.name}</span>
        </div>
        <ProjectsInlineEffectComponent
          projectId={projectIds[0]}
          updateProjects={updateProjects}
          projects={projects}
        />
      </>
    );
  }

  return (
    <>
      <div className={cn('flex items-center gap-1 flex-wrap', className)}>
        {displayProjects.slice(0, 2).map((project) => (
          <Badge key={project._id} variant="secondary" className="text-xs">
            <IconClipboard className="h-3 w-3 mr-1" />
            {project.name}
          </Badge>
        ))}
        {displayProjects.length > 2 && (
          <Badge variant="secondary" className="text-xs">
            +{displayProjects.length - 2} more
          </Badge>
        )}
      </div>
      {projectIds?.map((projectId) => (
        <ProjectsInlineEffectComponent
          key={projectId}
          projectId={projectId}
          updateProjects={updateProjects}
          projects={projects}
        />
      ))}
    </>
  );
};

export const SelectProjectProvider = ({
  children,
  mode = 'single',
  value,
  onValueChange,
  projects,
}: {
  children: React.ReactNode;
  mode?: 'single' | 'multiple';
  value?: string[] | string;
  onValueChange: (value: string[] | string) => void;
  projects?: IProject[];
}) => {
  const [_projects, setProjects] = useState<IProject[]>(projects || []);

  const isSingleMode = mode === 'single';

  const onSelect = (project: IProject) => {
    if (!project) return;
    if (isSingleMode) {
      setProjects([project]);
      return onValueChange?.(project._id);
    }

    const arrayValue = Array.isArray(value) ? value : [];

    const isProjectSelected = arrayValue.includes(project._id);
    const newSelectedProjectIds = isProjectSelected
      ? arrayValue.filter((id) => id !== project._id)
      : [...arrayValue, project._id];

    setProjects((prev) =>
      [...prev, project].filter((p) => newSelectedProjectIds.includes(p._id)),
    );
    onValueChange?.(newSelectedProjectIds);
  };

  // useEffect(() => {
  //   if (projects && projects.length > 0) {
  //     setProjects((prev) => {
  //       const existingIds = prev.map((p) => p._id);
  //       const newProjects = projects.filter(
  //         (p) => !existingIds.includes(p._id),
  //       );
  //       return [...prev, ...newProjects];
  //     });
  //   }
  // }, [projects]);
  return (
    <SelectProjectContext.Provider
      value={{
        projects: _projects,
        projectIds: !value ? [] : Array.isArray(value) ? value : [value],
        onSelect,
        setProjects,
        loading: false,
        error: null,
      }}
    >
      {children}
    </SelectProjectContext.Provider>
  );
};

const SelectProjectValue = ({ placeholder }: { placeholder?: string }) => {
  const { projectIds, projects, setProjects } = useSelectProjectContext();
  return (
    <ProjectsInline
      projectIds={projectIds}
      projects={projects}
      updateProjects={setProjects}
      placeholder={placeholder}
    />
  );
};

const SelectProjectCommandItem = ({ project }: { project: IProject }) => {
  const { onSelect, projectIds } = useSelectProjectContext();

  return (
    <Command.Item
      value={project._id}
      onSelect={() => {
        onSelect(project);
      }}
    >
      <div className="flex items-center gap-2">
        <IconClipboard className="h-4 w-4" />
        <span className="truncate font-medium">{project.name}</span>
      </div>
      <Combobox.Check checked={projectIds.includes(project._id)} />
    </Command.Item>
  );
};

const SelectProjectContent = () => {
  const { projects: selectedProjects, projectIds } = useSelectProjectContext();
  const { teamId } = useParams();
  const {
    projects = [],
    loading,
    handleFetchMore: _handleFetchMore,
    totalCount = 0,
  } = useProjects({
    variables: {
      teamIds: teamId ? [teamId] : undefined,
    },
  });

  const handleFetchMore = () => {
    _handleFetchMore({ direction: EnumCursorDirection.FORWARD });
  };
  return (
    <Command shouldFilter={false} id="project-command-menu">
      <Command.List>
        <Combobox.Empty loading={loading} />
        {projectIds.length > 0 && (
          <>
            {selectedProjects?.map((project) => (
              <SelectProjectCommandItem key={project._id} project={project} />
            ))}
            <Command.Separator className="my-1" />
          </>
        )}
        {projects
          .filter(
            (project) => !selectedProjects.some((p) => p._id === project._id),
          )
          .map((project) => (
            <SelectProjectCommandItem key={project._id} project={project} />
          ))}
        <Combobox.FetchMore
          fetchMore={handleFetchMore}
          totalCount={totalCount}
          currentLength={projects.length}
        />
      </Command.List>
    </Command>
  );
};

export const SelectProjectFilterItem = () => {
  return (
    <Filter.Item value="project">
      <IconClipboard />
      Project
    </Filter.Item>
  );
};

export const SelectProjectFilterView = ({
  onValueChange,
  queryKey,
  mode = 'single',
}: {
  onValueChange?: (value: string[] | string) => void;
  queryKey?: string;
  mode?: 'single' | 'multiple';
}) => {
  const [project, setProject] = useQueryState<string[] | string>(
    queryKey || 'project',
  );
  const { resetFilterState } = useFilterContext();

  return (
    <Filter.View filterKey={queryKey || 'project'}>
      <SelectProjectProvider
        mode={mode}
        value={project || (mode === 'single' ? '' : [])}
        onValueChange={(value: string[] | string) => {
          setProject(value);
          resetFilterState();
          onValueChange?.(value);
        }}
      >
        <SelectProjectContent />
      </SelectProjectProvider>
    </Filter.View>
  );
};

export const SelectProjectFilterBar = ({
  iconOnly,
  onValueChange,
  queryKey,
  mode = 'single',
}: {
  iconOnly?: boolean;
  onValueChange?: (value: string[] | string) => void;
  queryKey?: string;
  mode?: 'single' | 'multiple';
}) => {
  const [project, setProject] = useQueryState<string[] | string>(
    queryKey || 'project',
  );
  const [open, setOpen] = useState(false);

  if (!project) {
    return null;
  }

  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconClipboard />
        {!iconOnly && 'Project'}
      </Filter.BarName>
      <SelectProjectProvider
        mode={mode}
        value={project || (mode === 'single' ? '' : [])}
        onValueChange={(value: string[] | string) => {
          if (value.length > 0) {
            setProject(value);
          } else {
            setProject(null);
          }
          setOpen(false);
          onValueChange?.(value);
        }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Filter.BarButton filterKey={queryKey || 'project'}>
              <SelectProjectValue />
            </Filter.BarButton>
          </Popover.Trigger>
          <Combobox.Content>
            <SelectProjectContent />
          </Combobox.Content>
        </Popover>
      </SelectProjectProvider>
      <Filter.BarClose filterKey={queryKey || 'project'} />
    </Filter.BarItem>
  );
};

export const SelectProjectInlineCell = ({
  onValueChange,
  scope,
  ...props
}: Omit<React.ComponentProps<typeof SelectProjectProvider>, 'children'> & {
  scope?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectProjectProvider
      onValueChange={(value: string[] | string) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...props}
    >
      <PopoverScoped open={open} onOpenChange={setOpen} scope={scope}>
        <RecordTableInlineCell.Trigger>
          <SelectProjectValue placeholder={''} />
        </RecordTableInlineCell.Trigger>
        <RecordTableInlineCell.Content>
          <SelectProjectContent />
        </RecordTableInlineCell.Content>
      </PopoverScoped>
    </SelectProjectProvider>
  );
};

export const SelectProjectFormItem = ({
  onValueChange,
  className,
  placeholder,
  teamId,
  ...props
}: Omit<React.ComponentProps<typeof SelectProjectProvider>, 'children'> & {
  className?: string;
  placeholder?: string;
  teamId?: string;
}) => {
  const [open, setOpen] = useState(false);
  const { projects } = useProjects({
    variables: {
      teamIds: [teamId],
    },
    skip: !teamId,
  });
  return (
    <SelectProjectProvider
      projects={projects}
      mode="single"
      onValueChange={(value: string[] | string) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Form.Control>
          <Combobox.TriggerBase className="w-full shadow-xs" asChild>
            <Button variant="secondary" className={cn('h-7', className)}>
              <SelectProjectValue placeholder={placeholder} />
            </Button>
          </Combobox.TriggerBase>
        </Form.Control>

        <Combobox.Content>
          <SelectProjectContent />
        </Combobox.Content>
      </Popover>
    </SelectProjectProvider>
  );
};

SelectProjectFormItem.displayName = 'SelectProjectFormItem';

const SelectProjectRoot = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<React.ComponentProps<typeof SelectProjectProvider>, 'children'> &
    React.ComponentProps<typeof Combobox.Trigger> & {
      placeholder?: string;
    }
>(({ onValueChange, className, mode, value, placeholder, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectProjectProvider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      mode={mode}
      value={value}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Combobox.Trigger
          ref={ref}
          className={cn('w-full inline-flex', className)}
          variant="outline"
          {...props}
        >
          <SelectProjectValue placeholder={placeholder} />
        </Combobox.Trigger>
        <Combobox.Content>
          <SelectProjectContent />
        </Combobox.Content>
      </Popover>
    </SelectProjectProvider>
  );
});

SelectProjectRoot.displayName = 'SelectProjectRoot';

export const SelectProjectDetail = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<
    React.ComponentProps<typeof SelectProjectProvider>,
    'children' | 'onValueChange'
  > & {
    className?: string;
    placeholder?: string;
    id?: string;
    onValueChange?: (value: string | string[]) => void;
  }
>(({ onValueChange, className, placeholder, id, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const { updateTask } = useUpdateTask();

  const handleValueChange = (value: string | string[]) => {
    if (id) {
      updateTask({
        variables: {
          _id: id,
          projectId: typeof value === 'string' ? value : value[0],
        },
      });
    }
    onValueChange?.(value);
    setOpen(false);
  };

  return (
    <SelectProjectProvider
      onValueChange={handleValueChange}
      mode="single"
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Combobox.TriggerBase
          ref={ref}
          className={cn('w-min shadow-xs', className)}
          asChild
        >
          <Button variant="secondary" className="h-7">
            <SelectProjectValue placeholder={placeholder} />
          </Button>
        </Combobox.TriggerBase>
        <Combobox.Content>
          <SelectProjectContent />
        </Combobox.Content>
      </Popover>
    </SelectProjectProvider>
  );
});

SelectProjectDetail.displayName = 'SelectProjectDetail';

export const SelectProject = Object.assign(SelectProjectRoot, {
  Provider: SelectProjectProvider,
  Value: SelectProjectValue,
  Content: SelectProjectContent,
  FilterItem: SelectProjectFilterItem,
  FilterView: SelectProjectFilterView,
  FilterBar: SelectProjectFilterBar,
  InlineCell: SelectProjectInlineCell,
  FormItem: SelectProjectFormItem,
  Detail: SelectProjectDetail,
});
