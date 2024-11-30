import { Cell } from '@tanstack/react-table';

export function ExampleTableCell({ cell }: { cell: Cell<Product, unknown> }) {
  return <div>{cell.getValue()}</div>;
}
