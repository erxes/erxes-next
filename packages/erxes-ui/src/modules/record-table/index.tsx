import { RecordTableBody } from './components/RecordTableBody';
import { RecordTableCell } from './record-table-cell/components/RecordTableCell';
import { RecordTableHead } from './components/RecordTableHead';
import { RecordTableHeader } from './components/RecordTableHeader';
import RecordTableInlineCell from './record-table-cell/components/RecordTableInlineCell';
import {
  RecordTableProvider,
  useRecordTable,
} from './components/RecordTableProvider';
import { RecordTableRoot } from './components/RecordTableRoot';
import { RecordTableRowSkeleton } from './components/RecordTableRowSkeleton';
import { RecordTableScrollArea } from './components/RecordTableScrollArea';

export const RecordTable = Object.assign(RecordTableRoot, {
  Provider: RecordTableProvider,
  Header: RecordTableHeader,
  Head: RecordTableHead,
  ScrollArea: RecordTableScrollArea,
  Body: RecordTableBody,
  Cell: RecordTableCell,
  useRecordTable: useRecordTable,
  InlineCell: RecordTableInlineCell,
  RowSkeleton: RecordTableRowSkeleton,
});
