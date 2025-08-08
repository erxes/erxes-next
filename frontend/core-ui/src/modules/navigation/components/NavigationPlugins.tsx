import { IconChevronLeft } from '@tabler/icons-react';
import { activePluginState, NavigationMenuGroup, Sidebar } from 'erxes-ui';
import { usePluginsNavigationGroups } from '../hooks/usePluginsModules';
import { useAtom } from 'jotai';

export const NavigationPluginExitButton = () => {
  const [activePlugin, setActivePlugin] = useAtom(activePluginState);

  if (!activePlugin) {
    return null;
  }

  return (
    <>
      <Sidebar.Group>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton onClick={() => setActivePlugin(null)}>
              <IconChevronLeft className="text-accent-foreground" />
              <span className="font-sans font-semibold text-accent-foreground">
                Exit {activePlugin}
              </span>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Group>
      <Sidebar.Separator />
    </>
  );
};

export const NavigationPlugins = () => {
  const navigationGroups = usePluginsNavigationGroups();
  const [activePlugin, setActivePlugin] = useAtom(activePluginState);

  if (activePlugin) {
    return (
      <NavigationMenuGroup
        name={
          activePlugin.charAt(0).toUpperCase() +
          activePlugin.slice(1) +
          ' modules'
        }
        separate
      >
        {navigationGroups[activePlugin].contents.map((Content) => (
          <Content key={Content.name} />
        ))}
      </NavigationMenuGroup>
    );
  }

  return (
    <NavigationMenuGroup name="Plugins">
      {Object.entries(navigationGroups).map(([name, group]) => (
        <Sidebar.MenuItem key={name}>
          <Sidebar.MenuButton onClick={() => setActivePlugin(name)}>
            {group.icon && <group.icon className="text-accent-foreground" />}
            <span className="capitalize">{name}</span>
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      ))}
    </NavigationMenuGroup>
  );
};

export const NavigationPluginActions = () => {
  const navigationGroups = usePluginsNavigationGroups();
  const [activePlugin] = useAtom(activePluginState);

  if (!activePlugin || !navigationGroups[activePlugin].actions.length) {
    return null;
  }

  return (
    <NavigationMenuGroup name="Actions">
      {navigationGroups[activePlugin].actions.map((Action) => (
        <Action key={Action.name} />
      ))}
    </NavigationMenuGroup>
  );
};
