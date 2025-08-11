import {
  activePluginState,
  NavigationMenuGroup,
  NavigationMenuLinkItem,
} from 'erxes-ui';
import { CORE_MODULES } from '~/plugins/constants/core-plugins.constants';
import { useAtomValue } from 'jotai';

export const NavigationCoreModules = () => {
  const activePlugin = useAtomValue(activePluginState);

  return (
    <NavigationMenuGroup name="Core modules" separate={activePlugin !== null}>
      {CORE_MODULES.filter((item) => !item.settingsOnly).map((item) => (
        <NavigationMenuLinkItem
          key={item.name}
          name={item.name}
          icon={item.icon}
          path={item.path}
        />
      ))}
    </NavigationMenuGroup>
  );
};
