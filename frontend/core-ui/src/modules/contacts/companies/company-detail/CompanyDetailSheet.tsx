import { IconLayoutSidebarLeftCollapse } from '@tabler/icons-react';

import { Button, Sheet, useQueryState, cn } from 'erxes-ui';
import { useAtomValue } from 'jotai';
import { renderingCompanyDetailAtom } from '@/contacts/states/companyDetailStates';
import { usePreviousHotkeyScope } from 'erxes-ui';
export const CompanyDetailSheet = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useQueryState<string>('companyId');
  const { goBackToPreviousHotkeyScope } = usePreviousHotkeyScope();

  const activeTab = useAtomValue(renderingCompanyDetailAtom);

  return (
    <Sheet
      open={!!open}
      onOpenChange={() => {
        setOpen(null);
        goBackToPreviousHotkeyScope();
      }}
    >
      <Sheet.View
        className={cn(
          'p-0 md:w-[calc(100vw-theme(spacing.4))] flex flex-col gap-0 transition-all duration-100 ease-out overflow-hidden flex-none sm:max-w-screen-2xl',
          !!activeTab && 'md:w-[calc(100vw-theme(spacing.4))]',
        )}
      >
        <Sheet.Header className="border-b p-3 flex-row items-center space-y-0 gap-3">
          <Button variant="ghost" size="icon">
            <IconLayoutSidebarLeftCollapse />
          </Button>
          <Sheet.Title>Company Detail</Sheet.Title>
          <Sheet.Close />
          <Sheet.Description className="sr-only">
            Company Detail
          </Sheet.Description>
        </Sheet.Header>
        {children}
      </Sheet.View>
    </Sheet>
  );
};
