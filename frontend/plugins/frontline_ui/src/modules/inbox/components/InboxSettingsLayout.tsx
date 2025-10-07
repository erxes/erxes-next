import { InboxSettingsTopbar } from '@/settings/components/InboxSettingsTopbar';
import { IconMailFilled } from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { PageHeader, PageHeaderEnd, PageHeaderStart } from 'ui-modules';

export const InboxSettingsLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col flex-auto w-full overflow-hidden">
      <PageHeader>
        <PageHeaderStart>
          <Button variant={'ghost'} className="font-semibold">
            <IconMailFilled className="w-4 h-4 text-accent-foreground" />
            Team inbox
          </Button>
        </PageHeaderStart>
        <PageHeaderEnd>
          <InboxSettingsTopbar />
        </PageHeaderEnd>
      </PageHeader>
      {children}
    </div>
  );
};
