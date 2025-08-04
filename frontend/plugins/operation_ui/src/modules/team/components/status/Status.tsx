import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { ITeamStatus } from '@/team/types';

export const Status = ({ status }: { status: ITeamStatus }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: status._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-2 p-2 bg-white border rounded shadow-sm my-1"
    >
      {status.name}
    </div>
  );
};
