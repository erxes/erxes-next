import { PageHeader, PageHeaderEnd, PageHeaderStart } from 'ui-modules';
import { Breadcrumb, Button } from 'erxes-ui';
import { Link, useLocation } from 'react-router-dom';
import { IconApi, IconPlus } from '@tabler/icons-react';

export function AppsHeader() {
  const { pathname } = useLocation();
  return (
    <PageHeader>
      <PageHeaderStart>
        <Breadcrumb>
          <Breadcrumb.List className="gap-1">
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to="/settings/apps">
                  <IconApi />
                  Apps
                </Link>
              </Button>
            </Breadcrumb.Item>
            {pathname.includes('/create-new-app') && (
              <>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Button variant={'ghost'} asChild>
                    <Link to="/settings/apps/create-new-app">New token</Link>
                  </Button>
                </Breadcrumb.Item>
              </>
            )}
          </Breadcrumb.List>
        </Breadcrumb>
      </PageHeaderStart>
      <PageHeaderEnd>
        <Button asChild>
          <Link to="/settings/apps/create-new-app">
            <IconPlus />
            Create App token
          </Link>
        </Button>
      </PageHeaderEnd>
    </PageHeader>
  );
}
