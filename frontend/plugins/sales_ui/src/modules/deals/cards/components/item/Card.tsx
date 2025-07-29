import { IconCalendarCheck, IconCalendarClock } from '@tabler/icons-react';
import { cn, useQueryState } from 'erxes-ui';

import { CSS } from '@dnd-kit/utilities';
import { DealsDatePicker } from '../common/DealsDatePicker';
import { EntitySelector } from './EntitySelector';
import { IDeal } from '@/deals/types/deals';
import { ItemFooter } from './Footer';
import { useDealDetail } from '../../hooks/useDeals';
import { useSortable } from '@dnd-kit/sortable';

type Props = {
  card?: IDeal;
  children?: React.ReactNode;
  className?: string;
};

export const Card = ({ card = {} as IDeal, children, className }: Props) => {
  const [salesItemId, setSalesItemId] = useQueryState<string>('salesItemId');

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const { name, startDate, closeDate, createdAt, assignedUsers } = card;

  const { loading } = useDealDetail();
  const isThisCardLoading = salesItemId === card._id && loading;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={cn(
        'bg-white rounded-md shadow min-h-[100px] flex flex-col justify-between relative',
        isThisCardLoading && 'animate-pulse',
      )}
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
};
