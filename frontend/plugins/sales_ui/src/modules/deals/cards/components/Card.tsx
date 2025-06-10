import { CSS } from '@dnd-kit/utilities';
import { IDeal } from '@/deals/types/deals';
import { useSortable } from '@dnd-kit/sortable';

type Props = {
  card: IDeal;
};

export const Card = ({ card }: Props) => {
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

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="p-2 bg-white rounded shadow min-h-[100px]"
    >
      {card.name}
    </div>
  );
};
