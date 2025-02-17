import { Breadcrumb } from 'erxes-ui';
import { IconInbox } from '@tabler/icons-react';

import { PluginHeader } from 'erxes-ui/modules/plugin-header/PluginHeader';

export const Inbox = () => {
  return (
    <>
      <PluginHeader title="Inbox" icon={IconInbox}>
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item className="hidden md:block">
              <Breadcrumb.Link href="/inbox">Team Inbox</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator className="hidden md:block" />
            <Breadcrumb.Item>
              <Breadcrumb.Page>Inbox</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </PluginHeader>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        Inbox veersion 1.0.3
      </div>
    </>
  );
};
