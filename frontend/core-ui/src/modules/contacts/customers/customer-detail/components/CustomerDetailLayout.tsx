import { Tabs as TabsPrimitive } from 'radix-ui';

import {
  Button,
  Resizable,
  Sheet,
  Sidebar,
  Tabs,
  useQueryState,
} from 'erxes-ui';

import { CustomerDetailSheet } from './CustomerDetailSheet';
import { IconMoodAnnoyed } from '@tabler/icons-react';
import { Spinner } from 'erxes-ui';
export const CustomerDetailLayout = ({
  children,
  actions,
  otherState,
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
  otherState?: 'loading' | 'not-found';
}) => {
  return (
    <CustomerDetailSheet className="sm:max-w-screen-lg">
      <Sheet.Content>
        {otherState === 'loading' && (
          <div className="flex items-center justify-center h-full">
            <Spinner size="large" />
          </div>
        )}
        {otherState === 'not-found' && (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <IconMoodAnnoyed
                className="w-16 h-16 text-muted-foreground"
                strokeWidth={1.5}
              />
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold w-full text-center">
                  Customer details not found
                </h2>
                <p className="text-accent-foreground w-full text-center">
                  There seems to be no data on this customer
                </p>
              </div>
              <Sheet.Close asChild>
                <Button variant="outline">Close</Button>
              </Sheet.Close>
            </div>
          </div>
        )}
        {!otherState && (
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
          </div>
        )}
      </Sheet.Content>
    </CustomerDetailSheet>
  );
};

const CustomerDetailTabs = ({ children }: { children: React.ReactNode }) => {
  const [selectedTab, setSelectedTab] = useQueryState<string>('tab');

  return (
    <Tabs
      value={selectedTab ?? 'overview'}
      onValueChange={setSelectedTab}
      className="flex-auto flex h-full"
      orientation="vertical"
    >
      <Tabs.List className="w-64" asChild>
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
