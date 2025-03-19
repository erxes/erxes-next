import { Resizable, Tabs, useQueryState } from 'erxes-ui';
import { ContactDetailActionsTrigger } from './ContactDetailActions';
import { ContactDetailSheet } from './ContactDetailSheet';

export const ContactDetailLayout = ({
  children,
  actions,
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  return (
    <ContactDetailSheet>
      <div className="flex h-auto flex-auto overflow-auto">
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
  const [selectedTab, setSelectedTab] = useQueryState<string>('tab');

  return (
    <Tabs
      value={selectedTab ?? 'overview'}
      onValueChange={setSelectedTab}
      className="flex-auto flex flex-col "
    >
      <Tabs.List className="h-12">
        <Tabs.Trigger value="overview" className="text-base h-full">
          Overview
        </Tabs.Trigger>
        <Tabs.Trigger value="plugins" className="text-base h-full">
          Plugins
        </Tabs.Trigger>
        <Tabs.Trigger value="properties" className="text-base h-full">
          Properties
        </Tabs.Trigger>
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
