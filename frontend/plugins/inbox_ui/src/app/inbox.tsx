import { IconInbox } from '@tabler/icons-react';

import { PluginHeader } from 'erxes-ui';

export const Inbox = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <PluginHeader title="Inbox" icon={IconInbox}>
        Inbox veersion 1.0.3
      </PluginHeader>
    </div>
  );
};
