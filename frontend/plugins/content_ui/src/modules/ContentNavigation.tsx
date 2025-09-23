import { IconLibraryPhoto } from '@tabler/icons-react';
import { NavigationMenuLinkItem } from 'erxes-ui';

export const ContentNavigation = () => {
  return (
    <div>
      <NavigationMenuLinkItem
        name="Knowledge Base"
        path="/content/knowledgebase"
      />
      <NavigationMenuLinkItem name="CMS" path="/content/cms" />
    </div>
  );
};
