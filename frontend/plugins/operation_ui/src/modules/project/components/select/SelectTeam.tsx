import React, { useState, useEffect } from 'react';
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
  Badge,
  IconComponent,
  Button,
  TextOverflowTooltip,
  PopoverScoped,
} from 'erxes-ui';
import { IconUsers } from '@tabler/icons-react';
import { ITeam } from '@/team/types';
import { useGetCurrentUsersTeams } from '@/team/hooks/useGetCurrentUsersTeams';
import { useUpdateProject } from '@/project/hooks/useUpdateProject';

interface SelectTeamContextType {
  teams: ITeam[];
  teamIds: string[];
  onSelect: (team: ITeam) => void;
  setTeams: (teams: ITeam[]) => void;
  loading: boolean;
  error: any;
}

const SelectTeamContext = React.createContext<SelectTeamContextType | null>(
  null,
);

const useSelectTeamContext = () => {
  const context = React.useContext(SelectTeamContext);
  if (!context) {
    throw new Error(
      'useSelectTeamContext must be used within SelectTeamProvider',
    );
  }
  return context;
};

export const SelectTeamProvider = ({
  children,
  mode = 'multiple',
  value,
  onValueChange,
  teams,
}: {
  children: React.ReactNode;
  mode?: 'single' | 'multiple';
  value?: string[] | string;
  onValueChange: (value: string[] | string) => void;
  teams?: ITeam[];
}) => {
  const [_teams, setTeams] = useState<ITeam[]>([]);
  const isSingleMode = mode === 'single';

  useEffect(() => {
    if (teams) {
      if (value) {
        const teamIds = Array.isArray(value) ? value : [value];
        const selectedTeams = teams.filter((team) =>
          teamIds.includes(team._id),
        );
        setTeams(selectedTeams);
      } else {
        setTeams([]);
      }
    }
  }, [teams, value]);

  const onSelect = (team: ITeam) => {
    if (!team) return;
    if (isSingleMode) {
      setTeams([team]);
      return onValueChange?.(team._id);
    }

    const arrayValue = Array.isArray(value) ? value : [];
    const isTeamSelected = arrayValue.includes(team._id);

    if (isTeamSelected && arrayValue.length === 1) {
      return;
    }

    const newSelectedTeamIds = isTeamSelected
      ? arrayValue.filter((id) => id !== team._id)
      : [...arrayValue, team._id];

    setTeams((prev) => {
      const existingTeams = prev.filter((t) =>
        newSelectedTeamIds.includes(t._id),
      );
      const newTeam =
        newSelectedTeamIds.includes(team._id) &&
        !prev.some((t) => t._id === team._id)
          ? team
          : null;
      return newTeam ? [...existingTeams, newTeam] : existingTeams;
    });
    onValueChange?.(newSelectedTeamIds);
  };

  const teamIds = Array.isArray(value) ? value : value ? [value] : [];

  return (
    <SelectTeamContext.Provider
      value={{
        teams: _teams,
        teamIds,
        onSelect,
        setTeams,
        loading: false,
        error: null,
      }}
    >
      {children}
    </SelectTeamContext.Provider>
  );
};

const SelectTeamBadgeValue = ({ placeholder }: { placeholder?: string }) => {
  const { teamIds, teams } = useSelectTeamContext();
  const selectedTeams = teams.filter((team) => teamIds.includes(team._id));
  if (selectedTeams.length === 0) {
    return (
      <span className="text-muted-foreground">
        {placeholder || 'Select teams...'}
      </span>
    );
  }

  return (
    <div className="flex gap-1 flex-wrap">
      {selectedTeams.map((team) => (
        <Badge
          key={team._id}
          variant="secondary"
          className="flex items-center gap-1"
        >
          <IconComponent name={team.icon} className="size-3" />
          {team.name}
        </Badge>
      ))}
    </div>
  );
};

const SelectTeamCommandItem = ({ team }: { team: ITeam }) => {
  const { onSelect, teamIds } = useSelectTeamContext();

  return (
    <Command.Item
      value={team._id}
      onSelect={() => {
        onSelect(team);
      }}
    >
      <div className="flex items-center gap-2 flex-1">
        <IconComponent name={team.icon} className="size-4" />
        <span className="font-medium">{team.name}</span>
      </div>
      <Combobox.Check checked={teamIds.includes(team._id)} />
    </Command.Item>
  );
};

const SelectTeamContent = ({ providedTeams }: { providedTeams?: ITeam[] }) => {
  const { teams: selectedTeams, loading: contextLoading } =
    useSelectTeamContext();

  const { teams: searchedTeams = [], loading: searchLoading } =
    useGetCurrentUsersTeams({
      skip: !!providedTeams,
    });

  const teams = providedTeams || searchedTeams;

  const loading = contextLoading || searchLoading;

  return (
    <Command shouldFilter={false} id="team-command-menu">
      <Command.List>
        <Combobox.Empty loading={loading} />
        {selectedTeams.length > 0 && (
          <>
            {selectedTeams?.map((team) => (
              <SelectTeamCommandItem key={team._id} team={team} />
            ))}
            {teams.filter(
              (team) => !selectedTeams.some((t) => t._id === team._id),
            ).length > 0 && <Command.Separator className="my-1" />}
          </>
        )}
        {teams
          .filter((team) => !selectedTeams.some((t) => t._id === team._id))
          .map((team) => (
            <SelectTeamCommandItem key={team._id} team={team} />
          ))}
      </Command.List>
    </Command>
  );
};

export const SelectTeamFilterItem = () => {
  return (
    <Filter.Item value="team">
      <IconUsers />
      Team
    </Filter.Item>
  );
};

export const SelectTeamFilterView = ({
  onValueChange,
  queryKey,
}: {
  onValueChange?: (value: string[] | string) => void;
  queryKey?: string;
}) => {
  const [team, setTeam] = useQueryState<string>(queryKey || 'team');
  const { resetFilterState } = useFilterContext();

  return (
    <Filter.View filterKey={queryKey || 'team'}>
      <SelectTeamProvider
        mode="single"
        value={team || ''}
        onValueChange={(value) => {
          setTeam(typeof value === 'string' ? value : '');
          resetFilterState();
          onValueChange?.(value);
        }}
      >
        <SelectTeamContent />
      </SelectTeamProvider>
    </Filter.View>
  );
};

export const SelectTeamFilterBar = ({
  iconOnly,
  onValueChange,
  queryKey,
}: {
  iconOnly?: boolean;
  onValueChange?: (value: string[] | string) => void;
  queryKey?: string;
}) => {
  const [team, setTeam] = useQueryState<string>(queryKey || 'team');
  const [open, setOpen] = useState(false);
  const { teams } = useGetCurrentUsersTeams();
  if (!team) {
    return null;
  }

  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconUsers />
        {!iconOnly && 'Team'}
      </Filter.BarName>
      <SelectTeamProvider
        mode="single"
        value={team || ''}
        teams={teams}
        onValueChange={(value) => {
          const hasValue = !!value;
          if (hasValue) {
            setTeam(typeof value === 'string' ? value : '');
          } else {
            setTeam(null);
          }
          setOpen(false);
          onValueChange?.(value);
        }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Filter.BarButton filterKey={queryKey || 'team'}>
              <SelectTeamBadgeValue />
            </Filter.BarButton>
          </Popover.Trigger>
          <Combobox.Content>
            <SelectTeamContent />
          </Combobox.Content>
        </Popover>
      </SelectTeamProvider>
      <Filter.BarClose filterKey={queryKey || 'team'} />
    </Filter.BarItem>
  );
};

export const SelectTeamInlineCell = ({
  id,
  value,
  teams,
  onValueChange,
  scope,
  ...props
}: {
  id?: string;
  value?: string[];
  teams?: ITeam[];
  onValueChange?: (value: string | string[]) => void;
  scope?: string;
} & Omit<
  React.ComponentProps<typeof SelectTeamProvider>,
  'children' | 'onValueChange' | 'value' | 'teams'
>) => {
  const { updateProject } = useUpdateProject();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(
    value || [],
  );

  useEffect(() => {
    setLocalSelectedIds(value || []);
  }, [value]);

  const handleValueChange = (value: string | string[]) => {
    if (id) {
      updateProject({
        variables: {
          _id: id,
          teamIds: value,
        },
      });
    }
    onValueChange?.(value);
  };

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open && id && teams) {
      const hasChanged =
        localSelectedIds.length !== (value || []).length ||
        !localSelectedIds.every((id) => (value || []).includes(id));

      if (hasChanged) {
        handleValueChange(localSelectedIds);
      }
    } else if (!open) {
      handleValueChange(localSelectedIds);
    }
  };

  const handleSelect = (team: ITeam) => {
    if (!team) return;

    const isSelected = localSelectedIds.includes(team._id);
    if (isSelected && localSelectedIds.length === 1) {
      return;
    }

    const newValue = isSelected
      ? localSelectedIds.filter((id) => id !== team._id)
      : [...localSelectedIds, team._id];

    setLocalSelectedIds(newValue);

    if (!id || !teams) {
      handleValueChange(newValue);
      setOpen(false);
    }
  };

  if (id && teams) {
    const selectedTeams = teams.filter((team) =>
      localSelectedIds.includes(team._id),
    );
    const filteredTeams = teams.filter((team) =>
      team.name.toLowerCase().includes(search.toLowerCase()),
    );

    return (
      <PopoverScoped
        open={open}
        onOpenChange={onOpenChange}
        closeOnEnter
        scope={scope}
      >
        <RecordTableInlineCell.Trigger>
          <div className="flex gap-1 min-h-[24px] items-center">
            {selectedTeams.length > 0 ? (
              selectedTeams.map((team) => (
                <Badge
                  key={team._id}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <IconComponent name={team.icon} className="size-4" />
                  {team.name}
                </Badge>
              ))
            ) : (
              <span className="text-accent-foreground text-sm">
                {'Team not selected'}
              </span>
            )}
          </div>
        </RecordTableInlineCell.Trigger>
        <RecordTableInlineCell.Content>
          <Command shouldFilter={false}>
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search team..."
              variant="secondary"
              wrapperClassName="flex-auto"
              focusOnMount
            />
            <Command.List className="max-h-[300px] overflow-y-auto">
              <Combobox.Empty loading={false} />
              {filteredTeams.map((team) => (
                <Command.Item
                  key={team._id}
                  value={team._id}
                  onSelect={() => handleSelect(team)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <IconComponent name={team.icon} className="size-4" />
                    <span className="font-medium">{team.name}</span>
                  </div>
                  <Combobox.Check
                    checked={localSelectedIds.includes(team._id)}
                  />
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </RecordTableInlineCell.Content>
      </PopoverScoped>
    );
  }

  return (
    <SelectTeamProvider
      mode="multiple"
      value={value || []}
      onValueChange={handleValueChange}
      teams={teams}
      {...props}
    >
      <PopoverScoped open={open} onOpenChange={setOpen} scope={scope}>
        <RecordTableInlineCell.Trigger>
          <SelectTeamBadgeValue placeholder={''} />
        </RecordTableInlineCell.Trigger>
        <RecordTableInlineCell.Content>
          <SelectTeamContent providedTeams={teams} />
        </RecordTableInlineCell.Content>
      </PopoverScoped>
    </SelectTeamProvider>
  );
};

const SelectTeamValue = () => {
  const { teamIds, teams } = useSelectTeamContext();
  const selectedTeams = teams.filter((team) => teamIds.includes(team._id));
  const teamNames = selectedTeams.map((team) => team.name).join(', ');
  if (selectedTeams.length === 0)
    return <span className="text-accent-foreground text-sm">{'Team'}</span>;

  return (
    <div className="flex items-center gap-2 max-w-[200px]">
      <IconComponent
        name={selectedTeams[0].icon}
        className="size-3 flex-shrink-0"
      />
      <TextOverflowTooltip
        className="text-base font-medium"
        value={teamNames}
      />
    </div>
  );
};

export const SelectTeamFormItem = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<
    React.ComponentProps<typeof SelectTeamProvider>,
    'children' | 'onValueChange'
  > & {
    className?: string;
    onChange?: (value: string | string[]) => void;
    onClick?: (e: React.MouseEvent) => void;
  }
>(({ onChange, className, onClick, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectTeamProvider
      onValueChange={(value) => {
        onChange?.(value);
      }}
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Form.Control>
          <Combobox.TriggerBase
            ref={ref}
            className={cn('w-min shadow-xs ', className)}
            asChild
          >
            <Button variant="secondary" className="h-7" onClick={onClick}>
              <SelectTeamValue />
            </Button>
          </Combobox.TriggerBase>
        </Form.Control>
        <Combobox.Content>
          <SelectTeamContent />
        </Combobox.Content>
      </Popover>
    </SelectTeamProvider>
  );
});

SelectTeamFormItem.displayName = 'SelectTeamFormItem';

export const SelectTeamDetail = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<
    React.ComponentProps<typeof SelectTeamProvider>,
    'children' | 'onValueChange'
  > & {
    className?: string;
    onChange?: (value: string | string[]) => void;
    onClick?: (e: React.MouseEvent) => void;
    id?: string;
  }
>(({ onChange, className, onClick, id, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const { updateProject } = useUpdateProject();

  const handleValueChange = (value: string[] | string) => {
    onChange?.(value);
    updateProject({
      variables: {
        _id: id,
        teamIds: value as string[],
      },
    });
    setOpen(false);
  };
  return (
    <SelectTeamProvider onValueChange={handleValueChange} {...props}>
      <Popover open={open} onOpenChange={setOpen}>
        <Combobox.TriggerBase
          ref={ref}
          className={cn('w-min shadow-xs ', className)}
          asChild
        >
          <Button variant="secondary" className="h-7" onClick={onClick}>
            <SelectTeamValue />
          </Button>
        </Combobox.TriggerBase>
        <Combobox.Content>
          <SelectTeamContent />
        </Combobox.Content>
      </Popover>
    </SelectTeamProvider>
  );
});

SelectTeamDetail.displayName = 'SelectTeamDetail';

const SelectTeamRoot = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<React.ComponentProps<typeof SelectTeamProvider>, 'children'> &
    React.ComponentProps<typeof Combobox.Trigger> & {
      placeholder?: string;
    }
>(({ onValueChange, className, mode, value, placeholder, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectTeamProvider
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
          <SelectTeamBadgeValue placeholder={placeholder} />
        </Combobox.Trigger>
        <Combobox.Content>
          <SelectTeamContent />
        </Combobox.Content>
      </Popover>
    </SelectTeamProvider>
  );
});

SelectTeamRoot.displayName = 'SelectTeamRoot';

export const SelectTeam = Object.assign(SelectTeamRoot, {
  Provider: SelectTeamProvider,
  Value: SelectTeamBadgeValue,
  Content: SelectTeamContent,
  FilterItem: SelectTeamFilterItem,
  FilterView: SelectTeamFilterView,
  FilterBar: SelectTeamFilterBar,
  InlineCell: SelectTeamInlineCell,
  FormItem: SelectTeamFormItem,
  Detail: SelectTeamDetail,
});
