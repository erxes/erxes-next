import { Icon } from '@tabler/icons-react';

import { Table } from '@tanstack/react-table';
import { QueryHookOptions } from '@apollo/client';

export type GetFetchValueHook = (
  columnId: string
) => (options?: QueryHookOptions) => { options: any; loading: boolean };

export interface IRecordTableContext {
  table: Table<any>;
  handleReachedBottom?: () => void;
  getFetchValueHook: GetFetchValueHook;
}

export interface IRecordTableColumn {
  id: string;
  icon: Icon;
  type: string;
  readOnly?: boolean;
}
