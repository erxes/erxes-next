import { RecordTableBody } from './RecordTableBody';
import { RecordTableCell } from '../record-table-cell/components/RecordTableCell';
import { RecordTableHead } from './RecordTableHead';
import { RecordTableHeader } from './RecordTableHeader';
import RecordTableInlineCell from '../record-table-cell/components/RecordTableInlineCell';
import { RecordTableProvider, useRecordTable } from './RecordTableProvider';
import { RecordTableRoot } from './RecordTableRoot';
import { RecordTableRowSkeleton } from './RecordTableRowSkeleton';
import { RecordTableScrollArea } from './RecordTableScrollArea';

export const RecordTable = {
  Provider: RecordTableProvider,
  Root: RecordTableRoot,
  Header: RecordTableHeader,
  Head: RecordTableHead,
  ScrollArea: RecordTableScrollArea,
  Body: RecordTableBody,
  Cell: RecordTableCell,
  useRecordTable: useRecordTable,
  InlineCell: RecordTableInlineCell,
  RowSkeleton: RecordTableRowSkeleton,
};
