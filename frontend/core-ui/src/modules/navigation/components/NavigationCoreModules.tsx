import { NavigationMenuGroup, NavigationMenuLinkItem } from 'erxes-ui';
import { CORE_MODULES } from '~/plugins/constants/core-plugins.constants';

export const NavigationCoreModules = () => {
  return (
    <NavigationMenuGroup name="Core modules">
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
