import { IconCode, IconSelect } from '@tabler/icons-react';
import { Collapsible, Sidebar } from 'erxes-ui';
import { ComponentsPath } from '@/types/paths/ComponentsPath';
import { useLocation } from 'react-router';
import { NavigationButton } from './NavigationButton';

export const SidebarNavigationComponents = () => {
  const pathname = useLocation().pathname;
  const isActive = pathname.includes(ComponentsPath.Index);
  return (
    <Sidebar.Group>
      <Sidebar.Menu>
        <Collapsible asChild open={isActive} className="group/collapsible">
          <Sidebar.MenuItem key="components">
            <span>
              <NavigationButton
                pathname="components"
                name="components"
                icon={IconCode}
              />
            </span>
            <Collapsible.Content>
              <Sidebar.Sub>
                <Sidebar.SubItem>
                  <Sidebar.SubButton
                    asChild
                    isActive={pathname.includes(ComponentsPath.Select)}
                  >
                    <NavigationButton
                      pathname="components/select"
                      name="select"
                      icon={IconSelect}
                    />
                  </Sidebar.SubButton>
                </Sidebar.SubItem>
              </Sidebar.Sub>
            </Collapsible.Content>
          </Sidebar.MenuItem>
        </Collapsible>
      </Sidebar.Menu>
    </Sidebar.Group>
  );
};
