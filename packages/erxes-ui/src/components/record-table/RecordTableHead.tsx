import React from 'react';
import { Header } from '@tanstack/react-table';
import { Table } from '../table';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../../lib/utils';
import { cva } from 'class-variance-authority';

export const recordTableHeadVariants = cva(
  'sticky z-[2] top-0 bg-background transition-transform transition-width duration-200 whitespace-nowrap text-[13px] [&:has([role=checkbox])]:border-r-0',
  {
    variants: {
      isDragging: {
        true: 'z-[3]',
      },
      isPinned: {
        left: 'z-[3] left-10 [&:has([role=checkbox])]:left-0',
        right: 'z-[3] right-0',
      },
    },
  }
);

export const RecordTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<'th'> & {
    header: Header<any, unknown>;
  }
>(({ header, children, ...props }, ref) => {
  const { column } = header;
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: column.id,
      disabled: !!column.getIsPinned(),
    });
  return (
    <Table.Head
      ref={setNodeRef}
      className={cn(
        recordTableHeadVariants({
          isDragging,
          isPinned:
            column.getIsPinned() === 'left'
              ? 'left'
              : column.getIsPinned() === 'right'
              ? 'right'
              : null,
        })
      )}
      style={{
        width: column.getSize(),
      }}
      {...attributes}
      {...listeners}
      {...props}
    >
      {children}
      {isDragging && (
        <div
          className="absolute top-0 left-0 w-full h-screen bg-neutral-400 opacity-50"
          style={{ transform: CSS.Translate.toString(transform) }}
        />
      )}
    </Table.Head>
  );
});
