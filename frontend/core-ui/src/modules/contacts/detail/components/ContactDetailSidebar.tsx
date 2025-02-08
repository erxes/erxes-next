import { Sidebar } from 'erxes-ui/components';
import { ContactSidebarMenuItem } from '@/contacts/detail/components/ContactSidebarMenuItem';
import { useQueryState } from 'nuqs';

export const ContactDetailSidebar = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedTab, setSelectedTab] = useQueryState('tab', {
    defaultValue: 'general',
  });

  return (
    <Sidebar.Provider
      className="items-start flex-1 overflow-hidden min-h-px"
      style={{ '--sidebar-width': '200px' } as React.CSSProperties}
    >
      <Sidebar collapsible="none" className="hidden md:flex flex-none">
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <ContactSidebarMenuItem
                  onClick={() => setSelectedTab('general')}
                  isActive={selectedTab === 'general'}
                >
                  General Information
                </ContactSidebarMenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
          <Sidebar.Separator className="-my-2" />
          <Sidebar.Group>
            <Sidebar.GroupLabel>Personal</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <ContactSidebarMenuItem
                  onClick={() => setSelectedTab('personal')}
                  isActive={selectedTab === 'personal'}
                >
                  Personal Info
                </ContactSidebarMenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
          <Sidebar.Separator className="-my-2" />
          <Sidebar.Group>
            <Sidebar.GroupLabel>Additional</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <ContactSidebarMenuItem
                  onClick={() => setSelectedTab('additional')}
                  isActive={selectedTab === 'additional'}
                >
                  Additional Info
                </ContactSidebarMenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>
      </Sidebar>
      <Sidebar.Inset className="flex-auto overflow-hidden h-full min-h-full">
        {children}
      </Sidebar.Inset>
    </Sidebar.Provider>
  );
};
