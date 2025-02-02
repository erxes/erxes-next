import { IconLayoutSidebarLeftCollapse } from '@tabler/icons-react';
import { useQueryState } from 'nuqs';

import { Button, Sheet, Sidebar, Tabs } from 'erxes-ui/components';

import { ContactGeneral } from '@/contacts/detail/components/ContactGeneral';
import { ContactSidebarMenuItem } from '@/contacts/detail/components/ContactSidebarMenuItem';

export const ContactDetailSheet = () => {
  const [open, setOpen] = useQueryState('contact_id');
  const [selectedTab, setSelectedTab] = useQueryState('tab', {defaultValue: 'general'});

  return (
    <Sheet open={!!open} onOpenChange={() => setOpen(null)}>
      <Sheet.Content className="p-0 sm:max-w-5xl w-full flex flex-col gap-0">
        <Sheet.Header className='border-b p-3 flex-row items-center space-y-0 gap-3'>
          <Button variant="ghost" size="icon">
            <IconLayoutSidebarLeftCollapse />
          </Button>
          <Sheet.Title>Contact Detail</Sheet.Title>
          <Sheet.Close/>
        </Sheet.Header>
        <Sidebar.Provider className='items-start flex-1 overflow-hidden' style={{'--sidebar-width': '200px'} as React.CSSProperties}>
          <Sidebar collapsible="none" className="hidden md:flex">
            <Sidebar.Content>
              <Sidebar.Group>
                <Sidebar.GroupContent>
                  <Sidebar.Menu>
                    <ContactSidebarMenuItem onClick={() => setSelectedTab('general')} isActive={selectedTab === 'general'}>
                      General Information
                    </ContactSidebarMenuItem>
                  </Sidebar.Menu>
                </Sidebar.GroupContent>
              </Sidebar.Group>
              <Sidebar.Separator className="-my-2" />
              <Sidebar.Group>
                <Sidebar.GroupLabel>
                  Personal
                </Sidebar.GroupLabel>
                <Sidebar.GroupContent>
                  <Sidebar.Menu>
                    <ContactSidebarMenuItem onClick={() => setSelectedTab('personal')} isActive={selectedTab === 'personal'}>
                      Personal Info
                    </ContactSidebarMenuItem>
                  </Sidebar.Menu>
                </Sidebar.GroupContent>
              </Sidebar.Group>
              <Sidebar.Separator className="-my-2" />
              <Sidebar.Group>
                <Sidebar.GroupLabel >
                  Additional
                </Sidebar.GroupLabel>
                <Sidebar.GroupContent>
                  <Sidebar.Menu>
                    <ContactSidebarMenuItem onClick={() => setSelectedTab('additional')} isActive={selectedTab === 'additional'}>
                      Additional Info
                    </ContactSidebarMenuItem>
                  </Sidebar.Menu>
                </Sidebar.GroupContent>
              </Sidebar.Group>
            </Sidebar.Content>
          </Sidebar>
          <Sidebar.Inset>
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className='flex-auto flex flex-col'>
              <Tabs.Content value="general" className='overflow-hidden flex-auto'>
                <ContactGeneral />
              </Tabs.Content>
            </Tabs>
          </Sidebar.Inset>
        </Sidebar.Provider>
      </Sheet.Content>
    </Sheet>
  );
};
