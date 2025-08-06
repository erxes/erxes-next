import {
  RecordTablePopover,
  RecordTableCellTrigger,
  RecordTableCellContent,
  Command,
  Combobox,
  Badge,
  IconComponent,
} from 'erxes-ui';
import { ITeam } from '@/team/types';
import { useState, useEffect } from 'react';
import { useUpdateProject } from '@/project/hooks/useUpdateProject';
interface TeamsSelectProps {
  id: string;
  value: string[];
  teams: ITeam[];
}

const TeamsSelect = ({ id, value, teams }: TeamsSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { updateProject } = useUpdateProject();
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(value);

  // Sync local state when prop changes
  useEffect(() => {
    setLocalSelectedIds(value);
  }, [value]);

  const selectedTeams = teams.filter((team) =>
    localSelectedIds.includes(team._id),
  );
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (teamId: string) => {
    const newValue = localSelectedIds.includes(teamId)
      ? localSelectedIds.filter((id) => id !== teamId)
      : [...localSelectedIds, teamId];
    setLocalSelectedIds(newValue);
  };

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      // Only update if there's a change
      const hasChanged =
        localSelectedIds.length !== value.length ||
        !localSelectedIds.every((id) => value.includes(id));

      if (hasChanged) {
        updateProject({
          variables: {
            _id: id,
            teamIds: localSelectedIds,
          },
        });
      }
    }
  };

  return (
    <RecordTablePopover open={open} onOpenChange={onOpenChange} closeOnEnter>
      <RecordTableCellTrigger>
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
      </RecordTableCellTrigger>
      <RecordTableCellContent>
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
                onSelect={() => handleSelect(team._id)}
              >
                <div className="flex items-center gap-2 flex-1">
                  <IconComponent name={team.icon} className="size-4" />
                  <span className="font-medium">{team.name}</span>
                </div>
                <Combobox.Check checked={localSelectedIds.includes(team._id)} />
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </RecordTableCellContent>
    </RecordTablePopover>
  );
};

export default TeamsSelect;
