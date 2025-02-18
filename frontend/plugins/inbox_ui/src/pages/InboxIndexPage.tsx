import { IconCaretDownFilled } from '@tabler/icons-react';

import { IconSettings } from '@tabler/icons-react';

import { Button } from 'erxes-ui';

import { IconInbox } from '@tabler/icons-react';
import { PluginHeader } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { InboxLayout } from '@/ui/components/InboxLayout';

export const InboxIndexPage = () => {
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
      <InboxLayout />
    </div>
  );
};
