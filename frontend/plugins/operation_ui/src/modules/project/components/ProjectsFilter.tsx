import { IconSearch } from '@tabler/icons-react';
import { Combobox, Command, Filter, useMultiQueryState } from 'erxes-ui';

import { ProjectHotKeyScope } from '@/project/types';
import { ProjectsTotalCount } from '@/project/components/ProjectsTotalCount';
import { PROJECTS_CURSOR_SESSION_KEY } from '@/project/constants';
import { SelectLead } from '@/project/components/select/SelectLead';
import { SelectTeam } from '@/project/components/select/SelectTeam';
import { SelectPriority } from '@/project/components/select/SelectPriority';
import { SelectStatus } from '@/project/components/select/SelectStatus';

const ProjectsFilterPopover = () => {
  const [queries] = useMultiQueryState<{
    searchValue: string;
    lead: string;
    team: string[];
    priority: string;
    status: string;
  }>(['searchValue', 'lead', 'team', 'priority', 'status']);

  const hasFilters = Object.values(queries || {}).some(
    (value) => value !== null,
  );

  return (
    <>
      <Filter.Popover scope={ProjectHotKeyScope.ProjectsPage}>
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
                <SelectLead.FilterItem />
                <SelectTeam.FilterItem />
                <SelectPriority.FilterItem />
                <SelectStatus.FilterItem />
              </Command.List>
            </Command>
          </Filter.View>
          <SelectLead.FilterView />
          <SelectTeam.FilterView />
          <SelectPriority.FilterView />
          <SelectStatus.FilterView />
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

export const ProjectsFilter = () => {
  const [queries] = useMultiQueryState<{
    searchValue: string;
    lead: string;
    team: string[];
    priority: string;
    status: string;
  }>(['searchValue', 'lead', 'team', 'priority', 'status']);
  const { searchValue } = queries || {};

  return (
    <Filter id="Projects-filter" sessionKey={PROJECTS_CURSOR_SESSION_KEY}>
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
        <SelectLead.FilterBar />
        <SelectTeam.FilterBar />
        <SelectPriority.FilterBar />
        <SelectStatus.FilterBar />
        <ProjectsFilterPopover />
        <ProjectsTotalCount />
      </Filter.Bar>
    </Filter>
  );
};
