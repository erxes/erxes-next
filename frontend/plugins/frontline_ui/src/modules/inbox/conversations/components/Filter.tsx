import { Combobox, Command, Filter, Separator, ToggleGroup } from 'erxes-ui';
import { InboxHotkeyScope } from '@/inbox/types/InboxHotkeyScope';
import {
  IconCalendarPlus,
  IconCheckbox,
  IconLayoutColumns,
  IconList,
  IconLoader,
  IconSquare,
  IconUserX,
} from '@tabler/icons-react';
import { SelectMember } from 'ui-modules';

export const FilterConversations = () => {
  return (
    <Filter id="inbox-filter-dropdown">
      <Filter.Bar>
        <Filter.Popover scope={InboxHotkeyScope.MainPage}>
          <Filter.Trigger isFiltered />
          <Combobox.Content className="w-64">
            <Filter.View>
              <Command>
                <Command.List className="p-0">
                  <ToggleGroup type="single" className="p-1">
                    <ToggleGroup.Item
                      value="split"
                      className="h-14 flex-col flex-auto gap-1 [&_svg]:size-5 text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground"
                      variant="default"
                    >
                      <IconLayoutColumns />
                      Split view
                    </ToggleGroup.Item>
                    <ToggleGroup.Item
                      value="list"
                      className="h-14 flex-col flex-auto gap-1 [&_svg]:size-5 text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground"
                      variant="default"
                    >
                      <IconList />
                      List view
                    </ToggleGroup.Item>
                  </ToggleGroup>
                  <Separator />
                  <ToggleGroup
                    type="single"
                    className="flex-col items-stretch p-1 gap-0.5"
                  >
                    <ToggleGroup.Item
                      value="resolved"
                      className="justify-start text-center"
                    >
                      <IconCheckbox />
                      Resolved
                    </ToggleGroup.Item>
                    <ToggleGroup.Item
                      value="unresolved"
                      className="justify-start text-center"
                    >
                      <IconSquare />
                      Unresolved
                    </ToggleGroup.Item>
                  </ToggleGroup>
                  <Separator />

                  <ToggleGroup
                    type="single"
                    className="flex-col items-stretch p-1 gap-0.5"
                  >
                    <SelectMember.FilterItem />
                    <ToggleGroup.Item
                      value="unassigned"
                      className="justify-start text-center"
                    >
                      <IconUserX />
                      Unassigned
                    </ToggleGroup.Item>
                    <ToggleGroup.Item
                      value="awaiting_response"
                      className="justify-start text-center"
                    >
                      <IconLoader />
                      Awaiting response
                    </ToggleGroup.Item>
                  </ToggleGroup>
                  <Separator />
                  <Filter.Item value="created" className="m-1">
                    <IconCalendarPlus />
                    Date created
                  </Filter.Item>
                  <Command.Separator />
                </Command.List>
              </Command>
            </Filter.View>
            <SelectMember.FilterView />
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
