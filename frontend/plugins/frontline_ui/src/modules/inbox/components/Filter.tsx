import { Combobox, Command, Filter } from 'erxes-ui';

export const FilterConversations = () => {
  return (
    <Filter id="inbox-filter-dropdown">
      {/* TODO: Add scope */}
      <Filter.Bar>
        <Filter.Popover scope="inbox">
          <Filter.Trigger isFiltered />
          <Combobox.Content className="w-64">
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
      </Filter.Bar>
    </Filter>
  );
};
