import { RecordTableMoreButton } from './components/MoreColumn';
import { RecordTableHead } from './components/RecordTableHead';
import { RecordTableHeader } from './components/RecordTableHeader';
import {
  RecordTableProvider,
  useRecordTable,
} from './components/RecordTableProvider';
import { RecordTableRoot } from './components/RecordTableRoot';
import { RecordTableRowSkeleton } from './components/RecordTableRowSkeleton';
import { RecordTableCell } from './record-table-cell/components/RecordTableCell';
import { RecordTableInlineHead } from './components/RecordTableInlineHead';
import { Table } from 'erxes-ui/components';
import { RecordTableRowList } from './components/RecordTableRowList';
import { RecordTableScroll } from './components/RecordTableScroll';

export * from './components/RecordTableCursor';

export const RecordTable = Object.assign(RecordTableRoot, {
  Provider: RecordTableProvider,
  Header: RecordTableHeader,
  Head: RecordTableHead,
  InlineHead: RecordTableInlineHead,
  RowList: RecordTableRowList,
  Body: Table.Body,
  Cell: RecordTableCell,
  useRecordTable: useRecordTable,
  RowSkeleton: RecordTableRowSkeleton,
  MoreButton: RecordTableMoreButton,
  Scroll: RecordTableScroll,
});
