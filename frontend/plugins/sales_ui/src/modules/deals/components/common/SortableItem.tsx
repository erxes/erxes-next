import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

export function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 999 : 'auto',
    backgroundColor: isDragging ? '#e0e0e0' : 'white',
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 8,
    marginBottom: 8,
  };

  return <div>hi</div>;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
