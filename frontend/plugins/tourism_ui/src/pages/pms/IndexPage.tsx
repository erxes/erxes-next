import {
  IconCaretDownFilled,
  IconCube,
  IconSettings,
} from '@tabler/icons-react';
import { Breadcrumb, Button, PageHeader, Separator } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { PmsCreateSheet } from '~/modules/pms/components/CreatePmsSheet';

export const IndexPage = () => {
  return (
    <div className="flex flex-col h-full">
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <IconCube />
                  Go to settings pms
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
          <PageHeader.LikeButton />
        </PageHeader.Start>
        <PageHeader.End>
          <Button variant="outline" asChild>
            <Link to="/settings/pms">
              <IconSettings />
              Go to settings
            </Link>
          </Button>
          <PmsCreateSheet />
        </PageHeader.End>
      </PageHeader>
    </div>
  );
};
