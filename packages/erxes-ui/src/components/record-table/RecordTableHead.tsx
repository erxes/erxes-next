import React from 'react';
import { Header } from '@tanstack/react-table';
import { Table } from '../table';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../../lib/utils';
import { cva } from 'class-variance-authority';

export const recordTableHeadVariants = cva(
  'sticky z-[2] top-0 bg-background transition-transform duration-200 whitespace-nowrap text-[13px] [&:has([role=checkbox])]:border-r-0 [&:has([role=checkbox])>span]:hidden',
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
        width: `calc(var(--header-${column.id}-size) * 1px)`,
      }}
      {...props}
    >
      {children}
      <span
        {...attributes}
        {...listeners}
        className="absolute top-0 left-0 w-full h-full"
      />
      {isDragging && (
        <div
          className="absolute top-0 left-0 w-full h-screen bg-neutral-400 opacity-50"
          style={{ transform: CSS.Translate.toString(transform) }}
        />
      )}

      <RecordTableHeadSize header={header} />
    </Table.Head>
  );
});

const RecordTableHeadSize = React.forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<'span'> & {
    header: Header<any, unknown>;
  }
>(({ header, children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        'absolute bottom-0 cursor-col-resize w-4 h-full right-0 z-10 select-none touch-none',
        header.column.getIsResizing() &&
          'after:content-[""] after:absolute after:inset-y-0 after:w-0.5 after:-right-px after:bg-blue-500'
      )}
      {...props}
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
    />
  );
});
