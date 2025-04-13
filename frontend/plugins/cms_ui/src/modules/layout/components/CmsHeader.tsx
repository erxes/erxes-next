import { IconPlus, IconSettings, IconCube } from '@tabler/icons-react';
import { Button } from 'erxes-ui/components';
import { PluginHeader } from 'erxes-ui';
import { Link, useLocation } from 'react-router-dom';
import { useCmsContext } from '~/modules/app/context/CmsContext';

export const CmsHeader = () => {
  const { selectedWebsite } = useCmsContext();

  const location = useLocation();
  const pathname = location.pathname;

  let addButtonLabel = '';
  let addButtonLink = '';

  if (pathname === '/cms') {
    addButtonLabel = 'Add website';
    addButtonLink = '/cms/create';
  } else if (pathname.includes('/cms/')) {
    const slug = pathname.split('/')[2];
    addButtonLabel = 'Add post';
    addButtonLink = `/cms/${slug}/create-post`;
  }

  return (
    <PluginHeader
      title="Content Management System"
      icon={IconCube}
      className="p-3 mx-0"
      separatorClassName="mb-0"
    >
      <Button variant="outline" asChild>
        <Link to="/settings/inbox">
          <IconSettings />
          Go to settings {selectedWebsite}
        </Link>
      </Button>

      {addButtonLabel && (
        <Button asChild>
          <Link to={addButtonLink}>
            <IconPlus /> {addButtonLabel}
          </Link>
        </Button>
      )}
    </PluginHeader>
  );
};
