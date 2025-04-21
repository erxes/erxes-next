import { IconPlus, IconSettings, IconCube } from '@tabler/icons-react';
import { Button } from 'erxes-ui/components';
import { PluginHeader } from 'erxes-ui';
import { Link, useLocation } from 'react-router-dom';
import { useCmsContext } from '~/modules/app/context/CmsContext';
import { AddtagForm } from '~/modules/tag/components/AddCmsTag';
import { AddCategoryForm } from '~/modules/category/components/AddCmsCategory';
import { AddWebsiteForm } from '~/modules/cms/components/AddCmsWebsite';

export const CmsHeader = () => {
  const { selectedWebsite } = useCmsContext();
  const location = useLocation();
  const pathname = location.pathname;

  const isTagsPage = pathname.endsWith('/tags');
  const isCategoryPage = pathname.endsWith('/categories');
  const isWebsitePage = pathname === '/cms';

  let addButtonLabel: string | null = null;
  let addButtonLink: string | null = null;

  if (
    !isTagsPage &&
    !isCategoryPage &&
    !isWebsitePage &&
    pathname.includes('/cms/')
  ) {
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
          Go to settings
        </Link>
      </Button>

      {isTagsPage && <AddtagForm />}
      {isCategoryPage && <AddCategoryForm />}
      {isWebsitePage && <AddWebsiteForm />}

      {!isTagsPage &&
        !isCategoryPage &&
        !isWebsitePage &&
        addButtonLabel &&
        addButtonLink && (
          <Button asChild>
            <Link to={addButtonLink}>
              <IconPlus /> {addButtonLabel}
            </Link>
          </Button>
        )}
    </PluginHeader>
  );
};
