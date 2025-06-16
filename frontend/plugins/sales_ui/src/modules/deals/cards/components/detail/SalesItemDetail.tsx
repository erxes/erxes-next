import { Button, Sheet, cn, useQueryState } from 'erxes-ui';

import { IconLayoutSidebarLeftCollapse } from '@tabler/icons-react';

export const SalesItemDetail = () => {
  const [open, setOpen] = useQueryState<string>('salesItemId');

  return (
    <>
      <div />
      <Sheet open={!!open} onOpenChange={() => setOpen(null)}>
        <Sheet.View
          className={cn(
            'p-0 md:w-[calc(100vw-theme(spacing.4))] flex flex-col gap-0 transition-all duration-100 ease-out overflow-hidden flex-none sm:max-w-screen-2xl',
          )}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
          }}
        >
          <Sheet.Header className="border-b p-3 flex-row items-center space-y-0 gap-3">
            <Button variant="ghost" size="icon">
              <IconLayoutSidebarLeftCollapse />
            </Button>
            <Sheet.Title>Customer Detail</Sheet.Title>
            <Sheet.Close />
            <Sheet.Description className="sr-only">
              Customer Detail
            </Sheet.Description>
          </Sheet.Header>
          hi
        </Sheet.View>
      </Sheet>
    </>
  );
};
