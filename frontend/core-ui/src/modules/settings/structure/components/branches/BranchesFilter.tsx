import { SettingsHotKeyScope } from '@/types/SettingsHotKeyScope';
import { IconGitBranch } from '@tabler/icons-react';
import { Command } from 'cmdk';
import { Combobox, Filter, PageSubHeader, useFilterContext } from 'erxes-ui';
import { useFilterQueryState } from 'erxes-ui/modules/filter/hooks/useFilterQueryState';
import React from 'react';
import { SelectBranch, SelectBranchCommand } from 'ui-modules';
import { BranchesTotalCount } from './BranchesTotalCount';

export const BranchesFilter = () => {
  return (
    <PageSubHeader>
      <Filter id="branches">
        <Filter.Bar>
          <Filter.Popover scope={SettingsHotKeyScope.BranchesPage}>
            <Filter.Trigger />
            <Combobox.Content>
              <Filter.View>
                <Command>
                  <Filter.CommandInput />
                  <Command.List>
                    <Filter.SearchValueTrigger />
                    <Filter.Item value="parentId">
                      <IconGitBranch /> By Parent
                    </Filter.Item>
                  </Command.List>
                </Command>
              </Filter.View>
              <BranchParentFilterView />
            </Combobox.Content>
          </Filter.Popover>
          <Filter.Dialog>
            <Filter.DialogStringView filterKey="searchValue" />
          </Filter.Dialog>
          <Filter.SearchValueBarItem />
          <BranchParentFilterBar />
          <BranchesTotalCount />
        </Filter.Bar>
      </Filter>
    </PageSubHeader>
  );
};

const BranchParentFilterView = () => {
  const [parentId, setParentId] = useFilterQueryState('parentId', 'parentId');
  const { resetFilterState } = useFilterContext();
  return (
    <Filter.View filterKey="parentId">
      <SelectBranchCommand
        selected={parentId as string}
        onSelect={(id) => {
          setParentId(id);
          resetFilterState();
        }}
        focusOnMount
      />
    </Filter.View>
  );
};

const BranchParentFilterBar = () => {
  const [parentId, setParentId] = useFilterQueryState('parentId', 'parentId');
  const { resetFilterState } = useFilterContext();
  if (!parentId) {
    return;
  }
  return (
    <Filter.BarItem>
      <Filter.BarName className="whitespace-nowrap">
        <IconGitBranch />
        By Parent
      </Filter.BarName>
      <SelectBranch
        value={parentId as string}
        className="h-full shadow-none rounded-none"
        onValueChange={(value) => {
          setParentId(value);
          resetFilterState();
        }}
      />
      <Filter.BarClose filterKey="parentId" />
    </Filter.BarItem>
  );
};
