import { IconSettings } from '@tabler/icons-react';

import { IconArrowsRightLeft } from '@tabler/icons-react';
import { PageHeader, Button, Breadcrumb, Separator } from 'erxes-ui';
import { Link } from 'react-router-dom';

export const AccountingHeader = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return (
    <PageHeader>
      <PageHeader.Start>
        <Breadcrumb>
          <Breadcrumb.List className="gap-1">
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to="/accounting">
                  <IconArrowsRightLeft />
                  Transactions
                </Link>
              </Button>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
        <Separator.Inline />
        <PageHeader.FavoriteToggleButton type="module" item="accounting" />
      </PageHeader.Start>
      <PageHeader.End>
        <Button variant="outline" asChild>
          <Link to="/settings/accounting">
            <IconSettings />
            Go to settings
          </Link>
        </Button>
        {children}
      </PageHeader.End>
    </PageHeader>
  );
};
