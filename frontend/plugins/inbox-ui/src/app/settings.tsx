import { Breadcrumb } from 'erxes-ui';
import { PluginHeader } from 'erxes-ui/modules/plugin-header/PluginHeader';
import { IconInbox } from '@tabler/icons-react';

const Settings = () => {
  return (
    <>
      <PluginHeader title="Inbox settings" icon={IconInbox}>
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item className="hidden md:block">
              <Breadcrumb.Link href="/settings">Settings</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator className="hidden md:block" />

            <Breadcrumb.Item>
              <Breadcrumb.Page>Team Inbox</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </PluginHeader>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        Inbox veersion 1.0.1 asdjkasjdklajsdkljlksda
      </div>
    </>
  );
};

export default Settings;
