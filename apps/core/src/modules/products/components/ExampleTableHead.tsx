import { flexRender, Header } from '@tanstack/react-table';
import { Button, cn } from 'erxes-ui';

import { Table } from 'erxes-ui';
import { Product } from './makeData';
import { getCommonPinningStyles } from '../utils/tableUtils';
import { useSortable } from '@dnd-kit/sortable';
import { CSSProperties } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { GripVerticalIcon } from 'lucide-react';

export default function ExampleTableHead({
  header,
}: {
  header: Header<Product, unknown>;
}) {
  const { column } = header;
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });
  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    // position: 'relative',
    // translate instead of transform to avoid squishing
    transition: 'width transform 0.2s ease-in-out',
    whiteSpace: 'nowrap',
    width: header.column.getSize(),
    // zIndex: isDragging ? 1 : 0,
  };
  return (
    <Table.Head
      key={header.id}
      //IMPORTANT: This is where the magic happens!
      style={{ ...getCommonPinningStyles(column), ...style }}
      className={cn(
        'sticky z-[2] top-0 bg-background',
        column.getIsPinned() && 'z-[3]',
        isDragging && 'z-[3]'
      )}
      colSpan={header.colSpan}
      ref={setNodeRef}
    >
      <div className="whitespace-nowrap">
        {header.isPlaceholder
          ? null
          : flexRender(
              header.column.columnDef.header,
              header.getContext()
            )}{' '}
        {/* Demo getIndex behavior */}
        <Button {...attributes} {...listeners} variant="ghost" size="icon">
          <GripVerticalIcon />
        </Button>
      </div>
      {!header.isPlaceholder && header.column.getCanPin() && (
        <div className="flex gap-1 justify-center">
          {header.column.getIsPinned() !== 'left' ? (
            <button
              className="border rounded px-2"
              onClick={() => {
                header.column.pin('left');
              }}
            >
              {'<='}
            </button>
          ) : null}
          {header.column.getIsPinned() ? (
            <button
              className="border rounded px-2"
              onClick={() => {
                header.column.pin(false);
              }}
            >
              X
            </button>
          ) : null}
          {header.column.getIsPinned() !== 'right' ? (
            <button
              className="border rounded px-2"
              onClick={() => {
                header.column.pin('right');
              }}
            >
              {'=>'}
            </button>
          ) : null}
        </div>
      )}
      <div
        {...{
          onDoubleClick: () => header.column.resetSize(),
          onMouseDown: header.getResizeHandler(),
          onTouchStart: header.getResizeHandler(),
          className: `resizer ${
            header.column.getIsResizing() ? 'isResizing' : ''
          }`,
        }}
        className="h-8 w-1 bg-red-500 absolute top-1 right-0"
      />
      {isDragging && (
        <div
          className="absolute top-0 left-0 w-full h-[3000px] bg-neutral-400 opacity-50"
          style={{ transform: CSS.Translate.toString(transform) }}
        />
      )}
    </Table.Head>
  );
}
