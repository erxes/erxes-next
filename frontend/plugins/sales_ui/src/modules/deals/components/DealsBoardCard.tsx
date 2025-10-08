import { BoardCardProps, Separator } from 'erxes-ui';
import { atom, useAtomValue, useSetAtom } from 'jotai';

import { Button } from 'erxes-ui';
// import { dealCountByBoardAtom } from '@/deals/states/dealsTotalCountState';
import { DateSelectDeal } from '@/deals/components/deal-selects/DateSelectDeal';
import { IconCalendarEventFilled } from '@tabler/icons-react';
import { ItemFooter } from '@/deals/cards/components/item/Footer';
// import { SelectCompany } from 'ui-modules';
import { SelectDealPriority } from '@/deals/components/deal-selects/SelectDealPriority';
import { allDealsMapState } from '@/deals/components/DealsBoard';
import { dealDetailSheetState } from '@/deals/states/dealDetailSheetState';
import { format } from 'date-fns';

export const dealBoardItemAtom = atom(
  (get) => (id: string) => get(allDealsMapState)[id],
);

export const DealsBoardCard = ({ id }: BoardCardProps) => {
  const {
    startDate,
    name,
    assignedUsers,
    _id,
    priority,
    createdAt,
    closeDate,
    labels,
  } = useAtomValue(dealBoardItemAtom)(id);
  const setActiveDeal = useSetAtom(dealDetailSheetState);

  // const setDealCountByBoard = useSetAtom(dealCountByBoardAtom);

  return (
    <div onClick={() => setActiveDeal(_id)}>
      <div className="flex items-center justify-between h-9 px-1.5">
        <DateSelectDeal
          value={startDate}
          id={_id}
          type="startDate"
          variant="card"
        />
        <DateSelectDeal
          value={closeDate}
          id={_id}
          type="closeDate"
          variant="card"
        />
      </div>
      <Separator />
      <div className="p-3 flex flex-col gap-3">
        {labels && labels.length !== 0 && (
          <div className="flex flex-wrap gap-1">
            {labels?.map((label) => (
              <span
                key={label._id}
                className="px-2 py-1 rounded-full text-xs font-medium"
              >
                {label.name}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-1">
          <h5 className="font-semibold">{name}</h5>
        </div>
        <div className="flex flex-wrap gap-1">
          <SelectDealPriority
            dealId={_id}
            value={priority || ''}
            variant="card"
          />
          {/* <SelectCompany
                  value={field.value}
                  onValueChange={field.onChange}
                /> */}
        </div>
      </div>
      <Separator />
      <div className="h-9 flex items-center justify-between px-1.5">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground px-1 hover:bg-background"
        >
          <IconCalendarEventFilled />
          {createdAt && format(new Date(createdAt), 'MMM dd, yyyy')}
        </Button>
        <ItemFooter createdAt={createdAt} assignedUsers={assignedUsers} />
      </div>
    </div>
  );
};
