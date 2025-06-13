import { IconChecks } from '@tabler/icons-react';
import { Combobox, Command, Filter } from 'erxes-ui';
import { IsActiveBar } from './IsActiveBar';
import { SettingsHotKeyScope } from '@/types/SettingsHotKeyScope';
import { SelectBranches, SelectDepartments, SelectUnit } from 'ui-modules';

export function TeamMemberFilterPopover() {
  return (
    <Filter.Popover scope={SettingsHotKeyScope.UsersPage}>
      <Filter.Trigger />
      <Combobox.Content>
        <Filter.View>
          <Command>
            <Filter.CommandInput placeholder="Filter" variant="secondary" />

            <Command.List className="p-1">
              <Filter.SearchValueTrigger />
              <SelectBranches.FilterItem value="branchIds" label="Branch" />
              <SelectDepartments.FilterItem
                value="departmentIds"
                label="Department"
              />
              <SelectUnit.FilterItem />
              <Command.Item className="flex items-center gap-1">
                <IconChecks />
                isActive
                <IsActiveBar />
              </Command.Item>
            </Command.List>
          </Command>
        </Filter.View>
        <SelectBranches.FilterView mode="multiple" filterKey="branchIds" />
        <SelectDepartments.FilterView
          mode="multiple"
          filterKey="departmentIds"
        />
        <SelectUnit.FilterView />
      </Combobox.Content>
    </Filter.Popover>
  );
}
