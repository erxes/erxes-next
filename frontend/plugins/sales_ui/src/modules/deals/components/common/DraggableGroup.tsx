import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import React from 'react';
import { SortableItem } from './SortableItem';

interface DraggableGroupProps {
  groupId: string;
  direction: 'vertical' | 'horizontal';
  items: string[];
  childrenMap: Record<string, React.ReactNode>;
}

export function DraggableGroup({
  groupId,
  direction,
  items,
  childrenMap,
}: DraggableGroupProps) {
  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      <div
        className="flex gap-3"
        style={{
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
          minWidth: 250,
          minHeight: 200,
          padding: 12,
          border: '1px solid #aaa',
          borderRadius: 12,
          backgroundColor: '#f9f9f9',
        }}
      >
        {items.map((id) => (
          <SortableItem key={id} id={id}>
            {childrenMap[id]}
          </SortableItem>
        ))}
      </div>
    </SortableContext>
  );
}
