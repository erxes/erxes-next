import { IconPlus, IconSettings, IconCube } from '@tabler/icons-react';
import { Button } from 'erxes-ui/components';
import { PluginHeader } from 'erxes-ui';
import { Link, useLocation } from 'react-router';

export const CmsHeader = () => {
  const location = useLocation();
  const pathname = location.pathname;

  let addButtonLabel = '';
  let addButtonLink = '';

  if (pathname === '/cms') {
    addButtonLabel = 'Add website';
    addButtonLink = '/cms/create';
  } else if (pathname.match(/^\/cms\/[^/]+\/posts$/)) {
    // matches /cms/web1/posts, /cms/anything/posts
    const slug = pathname.split('/')[2];
    addButtonLabel = 'Add post';
    addButtonLink = `/cms/${slug}/create`;
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
          Go to settings
        </Link>
      </Button>

      {addButtonLabel && (
        <Link to={addButtonLink}>
          <Button>
            <IconPlus /> {addButtonLabel}
          </Button>
        </Link>
      )}
    </PluginHeader>
  );
};
