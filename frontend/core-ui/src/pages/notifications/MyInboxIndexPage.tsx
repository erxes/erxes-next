import { PageHeader } from 'ui-modules';
import { Breadcrumb, Separator, Button } from 'erxes-ui';
import { Link } from 'react-router';
import { IconMailbox, IconSettings } from '@tabler/icons-react';
import { MyInboxLayout } from '@/notification/my-inbox/components/MyInboxLayout';
import { Notifications } from '@/notification/my-inbox/components/Notifications';
import { NotificationContent } from '@/notification/my-inbox/components/NotificationContent';

export const MyInboxIndexPage = () => {
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
