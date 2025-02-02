import { Tabs } from 'erxes-ui/components/tabs';

import { Resizable } from 'erxes-ui/components';
import { ContactDetailActionsTrigger } from './ContactDetailActions';
import { ContactDetailSheet } from './ContactDetailSheet';
import { ContactDetailSidebar } from './components/ContactDetailSidebar';
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
      <ContactDetailSidebar>
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
      </ContactDetailSidebar>
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
