import { RecordTableBody } from './components/RecordTableBody';
import { RecordTableHead } from './components/RecordTableHead';
import { RecordTableHeader } from './components/RecordTableHeader';
import {
  RecordTableProvider,
  useRecordTable,
} from './components/RecordTableProvider';
import { RecordTableRoot } from './components/RecordTableRoot';
import { RecordTableRowSkeleton } from './components/RecordTableRowSkeleton';
import { RecordTableCell } from './record-table-cell/components/RecordTableCell';

export const RecordTable = Object.assign(RecordTableRoot, {
  Provider: RecordTableProvider,
  Header: RecordTableHeader,
  Head: RecordTableHead,
  Body: RecordTableBody,
  Cell: RecordTableCell,
  useRecordTable: useRecordTable,
  RowSkeleton: RecordTableRowSkeleton,
});
