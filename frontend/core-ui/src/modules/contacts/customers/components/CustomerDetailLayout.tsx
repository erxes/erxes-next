import { Resizable, Tabs, useQueryState } from 'erxes-ui';
import { CustomerDetailSheet } from '../customer-detail/components/CustomerDetailSheet';
import { useWidget } from 'ui-modules';

export const CustomerDetailLayout = ({
  children,
  actions,
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  const { Widget } = useWidget();
  const [contactId] = useQueryState<string>('contact_id');
  return (
    <CustomerDetailSheet>
      <div className="flex h-full flex-auto overflow-auto">
        <div className="flex flex-col flex-auto min-h-full overflow-hidden">
          <Resizable.PanelGroup
            direction="horizontal"
            className="flex-auto min-h-full overflow-hidden"
          >
            <Resizable.Panel>
              <CustomerDetailTabs>{children}</CustomerDetailTabs>
            </Resizable.Panel>
            {actions}
          </Resizable.PanelGroup>
        </div>
        <Widget contentType="core:customer" contentId={contactId || ''} />
      </div>
    </CustomerDetailSheet>
  );
};

const CustomerDetailTabs = ({ children }: { children: React.ReactNode }) => {
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

export const CustomerDetailTabContent = ({
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
