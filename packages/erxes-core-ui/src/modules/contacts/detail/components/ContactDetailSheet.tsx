import { IconLayoutSidebarLeftCollapse } from '@tabler/icons-react';
import { useQueryState } from 'nuqs';

import { Button, Sheet } from 'erxes-ui/components';

import { useRecoilValue } from 'recoil';
import { contactDetailActiveActionTabAtom } from '@/contacts/detail/states/contactDetailStates';
import { cn } from 'erxes-ui/lib';

export const ContactDetailSheet = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useQueryState('contact_id');

  const activeTab = useRecoilValue(contactDetailActiveActionTabAtom);

  return (
    <Sheet open={!!open} onOpenChange={() => setOpen(null)}>
      <Sheet.Content
        className={cn(
          'p-0 md:max-w-screen-2xl flex flex-col gap-0 transition-all duration-100 ease-out',
          !!activeTab && 'md:w-[calc(100vw-theme(spacing.4))]',
        )}
      >
        <Sheet.Header className="border-b p-3 flex-row items-center space-y-0 gap-3">
          <Button variant="ghost" size="icon">
            <IconLayoutSidebarLeftCollapse />
          </Button>
          <Sheet.Title>Contact Detail</Sheet.Title>
          <Sheet.Close />
          <Sheet.Description className="sr-only">
            Contact Detail
          </Sheet.Description>
        </Sheet.Header>
        {children}
      </Sheet.Content>
    </Sheet>
  );
};
