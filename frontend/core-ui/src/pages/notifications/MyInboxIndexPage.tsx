import { MyInboxLayout } from '@/notification/my-inbox/components/MyInboxLayout';
import { NotificationContent } from '@/notification/my-inbox/components/NotificationContent';
import { Notifications } from '@/notification/my-inbox/components/Notifications';
import { IconMailbox, IconNotification } from '@tabler/icons-react';
import { Breadcrumb, Button, Separator, Sheet } from 'erxes-ui';
import { useState } from 'react';
import { Link } from 'react-router';
import { PageHeader } from 'ui-modules';

export const MyInboxIndexPage = () => {
  const [isOpenMenu, setOpenMenu] = useState(false);
  return (
    <div tabIndex={0} className="flex flex-col h-full">
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
        </PageHeader.End>
      </PageHeader>
      <MyInboxLayout
        Notifications={Notifications}
        NotificationContent={NotificationContent}
      />
    </div>
  );
};
