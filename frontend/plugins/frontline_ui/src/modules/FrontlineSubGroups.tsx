import { ChooseIntegrationTypeContent } from '@/integrations/components/ChooseIntegrationType';
import { InboxActions } from '@/inbox/components/InboxActions';
import { NavigationMenuGroup } from 'erxes-ui';
import { useLocation } from 'react-router-dom';

export const FrontlineSubGroups = () => {
  const location = useLocation();

  if (!location.pathname.startsWith('/frontline/inbox')) {
    return null;
  }

  return (
    <>
      {location.pathname.startsWith('/frontline/inbox') && <InboxActions />}
      <NavigationMenuGroup name="Integration types">
        <ChooseIntegrationTypeContent />
      </NavigationMenuGroup>
    </>
  );
};
