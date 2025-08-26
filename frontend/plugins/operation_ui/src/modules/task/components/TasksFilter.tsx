import { IconSearch } from '@tabler/icons-react';
import { Combobox, Command, Filter, useMultiQueryState } from 'erxes-ui';

import { TaskHotKeyScope } from '@/task/TaskHotkeyScope';
import { TasksTotalCount } from '@/task/components/TasksTotalCount';
import { TASKS_CURSOR_SESSION_KEY } from '@/task/constants';
import { SelectTeam } from '@/task/components/select/SelectTeam';
import { SelectPriority } from '@/priority/components/SelectPriority';
import { SelectStatus } from '@/task/components/select/SelectStatus';
import { SelectAssignee } from '@/task/components/select/SelectAssignee';
import { useParams } from 'react-router-dom';

const TasksFilterPopover = () => {
  const { teamId } = useParams();
  const [queries] = useMultiQueryState<{
    searchValue: string;
    assignee: string;
    team: string;
    priority: string;
    status: string;
    statusType: string;
  }>(['searchValue', 'assignee', 'team', 'priority', 'status', 'statusType']);

  const hasFilters = Object.values(queries || {}).some(
    (value) => value !== null,
  );

  return (
    <>
      <Filter.Popover scope={TaskHotKeyScope.TasksPage}>
        <Filter.Trigger isFiltered={hasFilters} />
        <Combobox.Content>
          <Filter.View>
            <Command>
              <Filter.CommandInput
                placeholder="Filter"
                variant="secondary"
                className="bg-background"
              />
              <Command.List className="p-1">
                <Filter.Item value="searchValue" inDialog>
                  <IconSearch />
                  Search
                </Filter.Item>
                <Command.Separator className="my-1" />
                <SelectAssignee.FilterItem />
                {teamId && <SelectTeam.FilterItem />}
                <SelectPriority.FilterItem />
                <SelectStatus.FilterItem />
              </Command.List>
            </Command>
          </Filter.View>
          <SelectAssignee.FilterView />
          <SelectTeam.FilterView />
          <SelectPriority.FilterView />
          {teamId ? (
            <SelectStatus.FilterView teamId={teamId} />
          ) : (
            <SelectStatus.TypeFilterView />
          )}
        </Combobox.Content>
      </Filter.Popover>
      <Filter.Dialog>
        <Filter.View filterKey="searchValue" inDialog>
          <Filter.DialogStringView filterKey="searchValue" />
        </Filter.View>
      </Filter.Dialog>
    </>
  );
};

export const TasksFilter = () => {
  const { teamId } = useParams();
  const [queries] = useMultiQueryState<{
    searchValue: string;
    assignee: string;
    team: string;
    priority: string;
    status: string;
    statusType: string;
  }>(['searchValue', 'assignee', 'team', 'priority', 'status', 'statusType']);
  const { searchValue } = queries || {};

  return (
    <Filter id="Tasks-filter" sessionKey={TASKS_CURSOR_SESSION_KEY}>
      <Filter.Bar>
        {searchValue && (
          <Filter.BarItem>
            <Filter.BarName>
              <IconSearch />
              Search
            </Filter.BarName>
            <Filter.BarButton filterKey="searchValue" inDialog>
              {searchValue}
            </Filter.BarButton>
            <Filter.BarClose filterKey="searchValue" />
          </Filter.BarItem>
        )}
        <SelectAssignee.FilterBar />
        {teamId && <SelectTeam.FilterBar />}
        <SelectPriority.FilterBar />
        <SelectStatus.FilterBar queryKey="statusType" />
        <TasksFilterPopover />
        <TasksTotalCount />
      </Filter.Bar>
    </Filter>
  );
};
