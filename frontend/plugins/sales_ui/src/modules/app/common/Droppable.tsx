import React from 'react';
import { useDroppable } from '@dnd-kit/core';

type Props = {
  children: React.ReactNode;
};

export const Droppable = (props: Props) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable',
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
};
