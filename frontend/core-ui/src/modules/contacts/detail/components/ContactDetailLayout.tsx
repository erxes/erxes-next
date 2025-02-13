import { Tabs } from 'erxes-ui/components/tabs';

import { Resizable } from 'erxes-ui/components';
import { ContactDetailActionsTrigger } from './ContactDetailActions';
import { ContactDetailSheet } from './ContactDetailSheet';
import { useQueryState } from 'nuqs';

export const ContactDetailLayout = ({
  children,
  actions,
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  return (
    <ContactDetailSheet>
      <div className="flex h-full">
        <div className="flex flex-col flex-auto min-h-full overflow-hidden">
          <Resizable.PanelGroup
            direction="horizontal"
            className="flex-auto min-h-full overflow-hidden"
          >
            <Resizable.Panel>
              <ContactDetailTabs>{children}</ContactDetailTabs>
            </Resizable.Panel>
            {actions}
          </Resizable.PanelGroup>
        </div>
        <ContactDetailActionsTrigger />
      </div>
    </ContactDetailSheet>
  );
};

const ContactDetailTabs = ({ children }: { children: React.ReactNode }) => {
  const [selectedTab, setSelectedTab] = useQueryState('tab', {
    defaultValue: 'general',
  });

  return (
    <Tabs
      value={selectedTab}
      onValueChange={setSelectedTab}
      className="flex-auto flex flex-col"
    >
      <Tabs.List>
        <Tabs.Trigger value="general">General</Tabs.Trigger>
        <Tabs.Trigger value="properties">Properties</Tabs.Trigger>
        <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        <Tabs.Trigger value="notes">Notes</Tabs.Trigger>
      </Tabs.List>
      {children}
    </Tabs>
  );
};

export const ContactDetailTabContent = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) => {
  return (
    <Tabs.Content value={value} className="flex-auto overflow-hidden">
      {children}
    </Tabs.Content>
  );
};
