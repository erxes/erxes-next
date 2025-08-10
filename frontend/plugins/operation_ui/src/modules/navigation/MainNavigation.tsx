import { IconClipboard, IconUserFilled } from '@tabler/icons-react';
import { NavigationMenuLinkItem } from 'erxes-ui';

export const MainNavigation = () => {
  return (
    <>
      <NavigationMenuLinkItem
        name="My tasks"
        icon={IconUserFilled}
        pathPrefix="operation"
        path="tasks"
      />
      <NavigationMenuLinkItem
        name="Projects"
        icon={IconClipboard}
        pathPrefix="operation"
        path="projects"
      />
    </>
  );
};
