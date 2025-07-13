import { PageHeader } from 'ui-modules';
import { Breadcrumb, Separator, Button, Sheet } from 'erxes-ui';
import { Link } from 'react-router';
import {
  IconLayoutSidebarLeftExpand,
  IconMailbox,
  IconNotification,
  IconSettings,
} from '@tabler/icons-react';
import { MyInboxLayout } from '@/notification/my-inbox/components/MyInboxLayout';
import { Notifications } from '@/notification/my-inbox/components/Notifications';
import { NotificationContent } from '@/notification/my-inbox/components/NotificationContent';
import { useState } from 'react';

export const MyInboxIndexPage = () => {
  const [isOpenMenu, setOpenMenu] = useState(false);
  return (
    <>
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to="/my-inbox">
                    <IconMailbox />
                    My Inbox
                  </Link>
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
        <PageHeader.End>
          <Sheet open={isOpenMenu} onOpenChange={setOpenMenu}>
            <Sheet.Trigger asChild>
              <Button variant="outline" size="icon" className="w-fit sm:hidden">
                <IconNotification />
                Open Notifications
              </Button>
            </Sheet.Trigger>
            <Sheet.View side="left">
              {isOpenMenu && (
                <Sheet.Content>
                  <Notifications />
                </Sheet.Content>
              )}
            </Sheet.View>
          </Sheet>
          <Button variant="outline" asChild>
            <Link to="/settings/notification">
              <IconSettings />
              Go to settings
            </Link>
          </Button>
        </PageHeader.End>
      </PageHeader>
      <MyInboxLayout
        Notifications={Notifications}
        NotificationContent={NotificationContent}
      />
    </>
  );
};
