import { IconFolder, IconGitBranch, IconUsersGroup } from '@tabler/icons-react';
import { Combobox, Command, Filter } from 'erxes-ui';
import { BranchFilter } from '@/settings/team-member/components/header/BranchFilter';
import { DepartmentFilter } from '@/settings/team-member/components/header/DepartmentFilter';
import { UnitFilter } from '@/settings/team-member/components/header/UnitFilter';

export function TeamMemberFilter() {
  return (
    <Filter.Popover>
      <Filter.Trigger />
      <Combobox.Content>
        <Filter.View>
          <Command>
            <Command.Input
              placeholder="Filter"
              variant="secondary"
              className="bg-background"
            />
            <Command.Separator />
            <Command.List className="p-1">
              <Filter.Item value="branchId">
                <IconGitBranch />
                Branch
              </Filter.Item>
              <Filter.Item value="departmentId">
                <IconFolder />
                Department
              </Filter.Item>
              <Filter.Item value="unitId">
                <IconUsersGroup />
                Unit
              </Filter.Item>
            </Command.List>
          </Command>
        </Filter.View>
        <BranchFilter />
        <DepartmentFilter />
        <UnitFilter />
      </Combobox.Content>
    </Filter.Popover>
  );
}
