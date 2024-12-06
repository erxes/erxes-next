import { flexRender } from '@tanstack/react-table';
import { Button, RecordTable } from 'erxes-ui';
import { makeData } from '../utils/makeData';
import { ChevronDownIcon, DotIcon, ListIcon } from 'lucide-react';
import { columns } from './columns';
import { ProductCommandBar } from './ProductCommandBar';
import { ProductsRecordTableOptions } from './ProductsRecordTableOptions';

const data = makeData(300);

export const ProductsRecordTable = () => {
  return (
    <>
      <div className="flex items-start justify-between h-9 flex-none">
        <Button variant="ghost" className="text-muted-foreground">
          <ListIcon className="w-4 h-4" />
          <span className="inline-flex items-center ">
            All
            <DotIcon className="w-4 h-4 -mx-0.5" />
            300
          </span>
          <ChevronDownIcon className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-muted-foreground">
            Filter
          </Button>
          <Button variant="ghost" className="text-muted-foreground">
            Sort
          </Button>
          <ProductsRecordTableOptions />
        </div>
      </div>
      <RecordTable.Provider
        columns={columns}
        data={data}
        className="flex-grow-0 basis-full overflow-hidden"
      >
        <RecordTable.ScrollArea className="h-full">
          <RecordTable.Root>
            <RecordTable.Header
              renderHead={(header) => (
                <RecordTable.Head header={header}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </RecordTable.Head>
              )}
            />
            <RecordTable.Body
              renderCell={(cell) => (
                <RecordTable.Cell cell={cell}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </RecordTable.Cell>
              )}
            />
          </RecordTable.Root>
        </RecordTable.ScrollArea>
        <ProductCommandBar />
      </RecordTable.Provider>
    </>
  );
};
