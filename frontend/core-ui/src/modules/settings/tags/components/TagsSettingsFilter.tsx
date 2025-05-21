import { Combobox, Command, Filter } from 'erxes-ui';
import { SettingsHotKeyScope } from '@/types/SettingsHotKeyScope';

export const TagsSettingFilter = () => {
  return (
    <Filter id="tags-filter">
      <Filter.Bar>
        <Filter.Popover scope={SettingsHotKeyScope.TagsPage}>
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
      </Filter.Bar>
    </Filter>
  );
};
