import { IconSearch } from '@tabler/icons-react';
import { Combobox, Command, Filter, useMultiQueryState } from 'erxes-ui';

import { ProjectHotKeyScope } from '@/project/constants/ProjectHotKeyScope';
import { ProjectsTotalCount } from '@/project/components/ProjectsTotalCount';
import { PROJECTS_CURSOR_SESSION_KEY } from '@/project/constants';
import { SelectLead } from '@/project/components/select/SelectLead';
import { SelectTeam } from '@/project/components/select/SelectTeam';
import { SelectStatus } from '@/project/components/select/SelectStatus';
import { useParams } from 'react-router-dom';
import { SelectPriority } from '@/task/components';

const ProjectsFilterPopover = () => {
  const { teamId } = useParams();

  const [queries] = useMultiQueryState<{
    name: string;
    lead: string;
    team: string[];
    priority: string;
    status: string;
  }>(['name', 'lead', 'team', 'priority', 'status']);

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
                <Filter.Item value="name" inDialog>
                  <IconSearch />
                  Search
                </Filter.Item>
                <Command.Separator className="my-1" />
                <SelectLead.FilterItem />
                {!teamId && <SelectTeam.FilterItem />}
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
        <Filter.View filterKey="name" inDialog>
          <Filter.DialogStringView filterKey="name" />
        </Filter.View>
      </Filter.Dialog>
    </>
  );
};

export const ProjectsFilter = () => {
  const { teamId } = useParams();

  const [queries] = useMultiQueryState<{
    name: string;
    lead: string;
    team: string[];
    priority: string;
    status: string;
  }>(['name', 'lead', 'team', 'priority', 'status']);
  const { name } = queries || {};

  return (
    <Filter id="Projects-filter" sessionKey={PROJECTS_CURSOR_SESSION_KEY}>
      <Filter.Bar>
        {name && (
          <Filter.BarItem>
            <Filter.BarName>
              <IconSearch />
              Search
            </Filter.BarName>
            <Filter.BarButton filterKey="name" inDialog>
              {name}
            </Filter.BarButton>
            <Filter.BarClose filterKey="name" />
          </Filter.BarItem>
        )}
        <SelectLead.FilterBar />
        {!teamId && <SelectTeam.FilterBar />}
        <SelectPriority.FilterBar />
        <SelectStatus.FilterBar />
        <ProjectsFilterPopover />
        <ProjectsTotalCount />
      </Filter.Bar>
    </Filter>
  );
};
