import { NotificationFilterMenu } from '@/notification/my-inbox/components/filter/NotificationFilterMenu';
import { NotificationFilterViews } from '@/notification/my-inbox/components/filter/NotificationFilterViews';
import { Combobox, Filter } from 'erxes-ui';
export const NotificationsFilters = () => {
  return (
    <Filter id="my-inbox-main-filter">
      <Filter.Popover scope="my-inbox-main-filter">
        <Filter.Trigger isFiltered />
        <Combobox.Content>
          <NotificationFilterMenu />
          <NotificationFilterViews />
        </Combobox.Content>
      </Filter.Popover>
      <NotificationFilterDialogs />
    </Filter>
  );
};

const NotificationFilterDialogs = () => {
  return (
    <Filter.Dialog>
      <Filter.View filterKey="createdAt" inDialog>
        <Filter.DialogDateView filterKey="createdAt" />
      </Filter.View>
    </Filter.Dialog>
  );
};
