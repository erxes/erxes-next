import {
  IconCalendarPlus,
  IconProgressCheck,
  IconSettings,
  IconSourceCode,
  IconUser,
} from '@tabler/icons-react';
import { Combobox, Command, Filter, useMultiQueryState } from 'erxes-ui';
export const LogsRecordTableFilter = () => {
  const [queries] = useMultiQueryState<{
    status: string[];
    source: string;
    action: string;
    assignedTo: string;
    createdAt: string;
  }>(['status', 'source', 'action', 'assignedTo', 'createdAt']);

  const hasFilters = Object.values(queries || {}).some(
    (value) => value !== null,
  );
  return (
    <>
      <Filter.Popover scope={'logs_page'}>
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
                <Filter.Item value="status" inDialog>
                  <IconProgressCheck />
                  Status
                </Filter.Item>
                <Filter.Item value="source" inDialog>
                  <IconSourceCode />
                  Source
                </Filter.Item>
                <Filter.Item value="action" inDialog>
                  <IconSettings />
                  Action
                </Filter.Item>
                <Filter.Item value="assignedTo">
                  <IconUser />
                  User
                </Filter.Item>
                <Command.Separator className="my-1" />
                <Filter.Item value="createdAt">
                  <IconCalendarPlus />
                  Created At
                </Filter.Item>
              </Command.List>
            </Command>
          </Filter.View>
          <Filter.View filterKey={'status'}>
            <Command shouldFilter={false}>
              <Command.Input
                variant="secondary"
                placeholder="Filter by branch"
              />
              <Command.List className="p-1">
                <Combobox.Empty />
                <Command.Item>dasdaskh</Command.Item>
              </Command.List>
            </Command>
          </Filter.View>
        </Combobox.Content>
      </Filter.Popover>
    </>
  );
};
