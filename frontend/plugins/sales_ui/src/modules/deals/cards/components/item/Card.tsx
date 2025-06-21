import { IconCalendarCheck, IconCalendarClock } from '@tabler/icons-react';

import { CSS } from '@dnd-kit/utilities';
import { DealsDatePicker } from '../common/DealsDatePicker';
import { EntitySelector } from './EntitySelector';
import { IDeal } from '@/deals/types/deals';
import { ItemFooter } from './Footer';
import { useSortable } from '@dnd-kit/sortable';

type Props = {
  card: IDeal;
};

export const Card = ({ card = {} as IDeal }: Props) => {
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

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white rounded-md shadow min-h-[100px] flex flex-col justify-between"
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
