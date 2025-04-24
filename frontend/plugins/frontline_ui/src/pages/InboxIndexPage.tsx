import {
  IconCaretDownFilled,
  IconInbox,
  IconSettings,
} from '@tabler/icons-react';
import { Button, PluginHeader } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { InboxLayout } from '@/inbox/components/InboxLayout';
import { ConversationDetail } from '@/inbox/conversation-detail/components/ConversationDetail';
import { Conversations } from '@/inbox/components/Conversations';
import { MainFilters } from '@/inbox/components/MainFilters';

const InboxIndexPage = () => {
  return (
    <div className="flex flex-col h-full">
      <PluginHeader
        title="Inbox"
        icon={IconInbox}
        className="p-3 mx-0"
        separatorClassName="mb-0"
      >
        <Button variant="outline" asChild>
          <Link to="/settings/inbox">
            <IconSettings />
            Go to settings
          </Link>
        </Button>
        <Button>
          More <IconCaretDownFilled />
        </Button>
      </PluginHeader>
      <InboxLayout
        conversations={<Conversations />}
        mainFilters={<MainFilters />}
        conversationDetail={<ConversationDetail />}
      />
    </div>
  );
};

export default InboxIndexPage;
