import { SettingsHotKeyScope } from '@/types/SettingsHotKeyScope';
import { Command } from 'cmdk';
import { Combobox, Filter, PageSubHeader } from 'erxes-ui';
import { PositionsTotalCount } from './PositionsTotalCount';

export const PositionsFilter = () => {
  return (
    <PageSubHeader>
      <Filter id="positions">
        <Filter.Bar>
          <Filter.Popover scope={SettingsHotKeyScope.DepartmentsPage}>
            <Filter.Trigger />
            <Combobox.Content>
              <Filter.View>
                <Command>
                  <Filter.CommandInput />
                  <Command.List>
                    <Filter.SearchValueTrigger />
                  </Command.List>
                </Command>
              </Filter.View>
            </Combobox.Content>
          </Filter.Popover>
          <Filter.Dialog>
            <Filter.DialogStringView filterKey="searchValue" />
          </Filter.Dialog>
          <Filter.SearchValueBarItem />
          <PositionsTotalCount />
        </Filter.Bar>
      </Filter>
    </PageSubHeader>
  );
};
