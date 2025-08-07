import { ChooseIntegrationTypeContent } from '@/integrations/components/ChooseIntegrationType';
import { NavigationMenuGroup } from 'erxes-ui';
import { useLocation } from 'react-router-dom';

export const FrontlineSubGroups = () => {
  const location = useLocation();

  if (!location.pathname.startsWith('/inbox')) {
    return null;
  }

  return (
    <NavigationMenuGroup name="Inbox">
      <ChooseIntegrationTypeContent />
    </NavigationMenuGroup>
  );
};
