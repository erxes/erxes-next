import { Icon } from '@tabler/icons-react';

import { Table } from '@tanstack/react-table';
import {
  MutationHookOptions,
  OperationVariables,
  QueryHookOptions,
} from '@apollo/client';

export type GetFetchValueHook = (
  columnId: string
) => (options?: QueryHookOptions) => { options: any; loading: boolean };

export type UseMutateValueHook = (columnId: string) => (
  options?: MutationHookOptions
) => {
  mutate: (variables: OperationVariables) => void;
  loading: boolean;
};

export interface IRecordTableContext {
  table: Table<any>;
  handleReachedBottom?: () => void;
  getFetchValueHook: GetFetchValueHook;
  useMutateValueHook: UseMutateValueHook;
}

export interface IRecordTableColumn {
  id: string;
  label: string;
  icon: Icon;
  type: string;
  readOnly?: boolean;
}
