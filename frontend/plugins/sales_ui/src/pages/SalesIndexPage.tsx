import {
  Breadcrumb,
  Button,
  PageContainer,
  PageSubHeader,
  Separator,
} from 'erxes-ui';
import { IconSandbox, IconSettings } from '@tabler/icons-react';

import { Link } from 'react-router-dom';
import MainActionBar from '@/deals/actionBar/components/MainActionBar';
import { PageHeader } from 'ui-modules';
import { SalesLeftSidebar } from '@/deals/components/SalesLeftSidebar';
import { StagesList } from '@/deals/stage/components/StagesList';

export const SalesIndexPage = () => {
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
          <div className="w-full h-full p-4 overflow-x-auto">
            <div className="flex gap-4 min-w-max h-full">
              <StagesList />
            </div>
          </div>
        </PageContainer>
      </div>
    </div>
  );
};
