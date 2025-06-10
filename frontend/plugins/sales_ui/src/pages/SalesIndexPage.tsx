import {
  Breadcrumb,
  Button,
  PageContainer,
  PageSubHeader,
  Separator,
} from 'erxes-ui';
import { IconSandbox, IconSettings } from '@tabler/icons-react';

import DealsMain from '~/modules/deals/Main';
import { Link } from 'react-router-dom';
import MainActionBar from '~/modules/deals/actionBar/components/MainActionBar';
import { PageHeader } from 'ui-modules';
import { SalesLeftSidebar } from '~/modules/deals/components/SalesLeftSidebar';

export const SalesIndexPage = (...props: any) => {
  return (
    <div className="flex h-full">
      <SalesLeftSidebar />
      <div className="flex flex-col h-full w-full">
        <PageHeader>
          <PageHeader.Start>
            <Breadcrumb>
              <Breadcrumb.List className="gap-1">
                <Breadcrumb.Item>
                  <Button variant="ghost" asChild>
                    <Link to="/sales">
                      <IconSandbox />
                      Sales
                    </Link>
                  </Button>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb>
            <Separator.Inline />
            <PageHeader.FavoriteToggleButton />
          </PageHeader.Start>
          <PageHeader.End>
            <Button variant="outline" asChild>
              <Link to="/settings/sales">
                <IconSettings />
                Go to settings
              </Link>
            </Button>
          </PageHeader.End>
        </PageHeader>
        <PageContainer>
          <PageSubHeader>
            <MainActionBar />
          </PageSubHeader>
          <DealsMain />
        </PageContainer>
      </div>
    </div>
  );
};
