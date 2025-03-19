import { IconSettings } from '@tabler/icons-react';

import { IconArrowsRightLeft } from '@tabler/icons-react';
import { PluginHeader, Button } from 'erxes-ui';
import { Link } from 'react-router-dom';

export const AccountingHeader = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return (
    <PluginHeader
      title="Transactions"
      icon={IconArrowsRightLeft}
      className="p-3 mx-0"
      separatorClassName="mb-0"
      to="/accounting"
    >
      <Button variant="outline" asChild>
        <Link to="/settings/accounting">
          <IconSettings />
          Go to settings
        </Link>
      </Button>
      {children}
    </PluginHeader>
  );
};
