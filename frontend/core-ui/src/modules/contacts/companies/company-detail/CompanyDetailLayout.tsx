import { Resizable, Sidebar, Tabs, useQueryState } from 'erxes-ui';
import { CompanyDetailSheet } from '@/contacts/companies/company-detail/CompanyDetailSheet';
import { Tabs as TabsPrimitive } from 'radix-ui';

export const CompanyDetailLayout = ({
  children,
  actions,
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  return (
    <CompanyDetailSheet>
      <div className="flex h-full flex-auto overflow-auto">
        <div className="flex flex-col flex-auto min-h-full overflow-hidden">
          <Resizable.PanelGroup
            direction="horizontal"
            className="flex-auto min-h-full overflow-hidden"
          >
            <Resizable.Panel>
              <CompanyDetailTabs>{children}</CompanyDetailTabs>
            </Resizable.Panel>
            {actions}
          </Resizable.PanelGroup>
        </div>
      </div>
    </CompanyDetailSheet>
  );
};

const CompanyDetailTabs = ({ children }: { children: React.ReactNode }) => {
  const [selectedTab, setSelectedTab] = useQueryState<string>('tab');

  return (
    <Tabs
      value={selectedTab ?? 'overview'}
      onValueChange={setSelectedTab}
      className="flex-auto flex h-full"
      orientation="vertical"
    >
      <TabsPrimitive.List className="w-64" asChild>
        <Sidebar collapsible="none" className="flex-none w-64 border-r">
          <Sidebar.Group>
            <Sidebar.GroupLabel>General</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <TabsPrimitive.Trigger value="overview" asChild>
                    <Sidebar.MenuButton className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                      Overview
                    </Sidebar.MenuButton>
                  </TabsPrimitive.Trigger>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <TabsPrimitive.Trigger value="plugins" asChild>
                    <Sidebar.MenuButton>Plugins</Sidebar.MenuButton>
                  </TabsPrimitive.Trigger>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <TabsPrimitive.Trigger value="properties" asChild>
                    <Sidebar.MenuButton>Properties</Sidebar.MenuButton>
                  </TabsPrimitive.Trigger>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
          <Sidebar.Separator />
          <Sidebar.Group></Sidebar.Group>
        </Sidebar>
      </TabsPrimitive.List>
      {children}
    </Tabs>
  );
};

export const CompanyDetailTabContent = ({
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
