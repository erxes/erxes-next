// @/components/ui/card.tsx
import * as React from 'react';

import { IconCalendarCheck, IconCalendarClock } from '@tabler/icons-react';

import { DealsDatePicker } from '@/deals/cards/components/common/DealsDatePicker';
import { EntitySelector } from '@/deals/cards/components/item/EntitySelector';
import { IDeal } from '@/deals/types/deals';
import { ItemFooter } from '@/deals/cards/components/item/Footer';
import { cn } from 'erxes-ui';
import { useQueryState } from 'erxes-ui';

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { loading?: boolean; card: IDeal }
>(({ className, loading, card, ...props }, ref) => {
  const [salesItemId, setSalesItemId] = useQueryState<string>('salesItemId');

  const { name, startDate, closeDate, createdAt, assignedUsers } = card;

  return (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-md shadow min-h-[100px] flex flex-col justify-between relative',
        loading && 'animate-pulse',
        className,
      )}
      {...props}
      onClick={() => setSalesItemId(card._id)}
    >
      <div className="flex justify-between border-b p-2">
        <DealsDatePicker
          date={startDate}
          Icon={IconCalendarClock}
          text="Start Date"
        />
        <DealsDatePicker
          date={closeDate}
          Icon={IconCalendarCheck}
          text="Close Date"
        />
      </div>
      <div className="flex flex-col h-full p-2 gap-2">
        <b>{name || 'Untitled Sales'}</b>
        <EntitySelector card={card} />
      </div>
      <ItemFooter createdAt={createdAt} assignedUsers={assignedUsers} />
    </div>
  );
});

Card.displayName = 'Card';
