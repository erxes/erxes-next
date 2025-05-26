import { Conversations } from '@/inbox/components/Conversations';
import { InboxLayout } from '@/inbox/components/InboxLayout';
import { MainFilters } from '@/inbox/components/MainFilters';
import { ConversationDetail } from '@/inbox/conversation-detail/components/ConversationDetail';
import { IconInbox, IconSettings } from '@tabler/icons-react';
import { Breadcrumb, Button, Separator } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { PageHeader } from 'ui-modules';

const InboxIndexPage = () => {
  return (
    <div className="flex flex-col h-full">
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to="/inbox">
                    <IconInbox />
                    Inbox
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
            <Link to="/settings/inbox">
              <IconSettings />
              Go to settings
            </Link>
          </Button>
        </PageHeader.End>
      </PageHeader>
      <InboxLayout
        conversations={<Conversations />}
        mainFilters={<MainFilters />}
        conversationDetail={<ConversationDetail />}
      />
    </div>
  );
};

export default InboxIndexPage;
