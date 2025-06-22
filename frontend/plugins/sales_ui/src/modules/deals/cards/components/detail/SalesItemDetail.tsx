import { Resizable, Sheet, cn, useQueryState } from 'erxes-ui';

import { IDeal } from '@/deals/types/deals';
import { SalesDetailActions } from './SalesDetailActions';
import { SalesDetailLeftSidebar } from './SalesDetailLeftSidebar';
import { SalesItemDetailHeader } from './SalesItemDetailHeader';
import { useDealDetail } from '@/deals/cards/hooks/useDeals';

export const SalesItemDetail = () => {
  const [open, setOpen] = useQueryState<string>('salesItemId');

  const { deal, loading: dealLoading } = useDealDetail();
  console.log('ccc', deal, dealLoading);
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
          <SalesItemDetailHeader deal={deal || ({} as IDeal)} />
          <Sheet.Content>
            <div className="flex h-full flex-auto overflow-auto">
              <div className="flex flex-col flex-auto min-h-full overflow-hidden">
                <Resizable.PanelGroup
                  direction="horizontal"
                  className="flex-auto min-h-full overflow-hidden"
                >
                  <Resizable.Panel>
                    <SalesDetailLeftSidebar>hi</SalesDetailLeftSidebar>
                  </Resizable.Panel>
                  <SalesDetailActions />
                </Resizable.PanelGroup>
              </div>
            </div>
          </Sheet.Content>
        </Sheet.View>
      </Sheet>
    </>
  );
};
