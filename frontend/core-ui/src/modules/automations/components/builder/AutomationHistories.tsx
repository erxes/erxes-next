import { useAutomationHistories } from '@/automations/hooks/useAutomationHistories';
import { IAutomationHistory } from '@/automations/types';
import {
  IconAutomaticGearbox,
  IconCalendarTime,
  IconDots,
  IconEye,
  IconTournament,
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import dayjs from 'dayjs';
import {
  Badge,
  Button,
  DropdownMenu,
  RecordTable,
  RecordTableCellDisplay,
  RelativeDateDisplay,
  Sheet,
  Tabs,
} from 'erxes-ui';
import { useState } from 'react';
import { IAction, ITrigger } from 'ui-modules';
import { AutomationHistoryDetail } from './history/AutomationHistoryDetail';

export const automationHistoriesColumns = (constants: {
  triggersConst: ITrigger[];
  actionsConst: IAction[];
}): ColumnDef<IAutomationHistory>[] => [
  {
    id: 'more',
    cell: ({ cell }) => (
      <AutomationHistoryDetail
        history={cell.row.original}
        constants={constants}
      />
    ),
    size: 33,
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: () => <RecordTable.InlineHead label="Title" />,
    cell: ({ cell }) => {
      const { triggerType, target } = cell.row.original;

      //   const Component = renderDynamicComponent(
      //     {
      //       target,
      //       triggerType,
      //       componentType: 'historyName'
      //     },
      //     triggerType
      //   );

      //   if (Component) {
      //     return Component;
      //   }

      return 'Empty';
    },
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: () => <RecordTable.InlineHead label="Description" />,
    cell: ({ cell }) => (
      <RecordTableCellDisplay>
        {cell.getValue() as string}
      </RecordTableCellDisplay>
    ),
  },
  {
    id: 'trigger',
    accessorKey: 'trigger',
    header: () => <RecordTable.InlineHead label="Trigger" />,
    cell: ({ cell }) => {
      const triggerType = cell.row?.original?.triggerType;

      const triggerLabel = constants.triggersConst.find(
        ({ type }) => type === triggerType,
      )?.label;

      return (
        <RecordTableCellDisplay>
          {triggerLabel || 'Empty'}
        </RecordTableCellDisplay>
      );
    },
  },

  {
    id: 'status',
    accessorKey: 'status',
    header: () => <RecordTable.InlineHead label="Status" />,
    cell: ({ cell }) => {
      const status = cell.getValue() as string;

      const variant = status === 'active' ? 'success' : 'warning';

      return (
        <RecordTableCellDisplay>
          <Badge variant={variant}>{status}</Badge>
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: () => (
      <RecordTable.InlineHead icon={IconCalendarTime} label="Created At" />
    ),
    cell: ({ cell }) => (
      <RecordTableCellDisplay>
        <RelativeDateDisplay.Value
          value={dayjs(cell.getValue() as string).format('YYYY-MM-DD HH:mm:ss')}
        />
      </RecordTableCellDisplay>
    ),
  },
];

const AUTOMATION_HISTORIES_CURSOR_SESSION_KEY = 'automation-histories-cursor';

export const AutomationHistories = () => {
  const {
    list,
    loading,
    triggersConst,
    actionsConst,
    handleFetchMore,
    hasNextPage,
    hasPreviousPage,
  } = useAutomationHistories();

  return (
    <div>
      <RecordTable.Provider
        columns={automationHistoriesColumns({ triggersConst, actionsConst })}
        data={list}
        className="mt-1.5"
        stickyColumns={['more']}
      >
        <RecordTable.CursorProvider
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          loading={loading}
          dataLength={list?.length}
          sessionKey={AUTOMATION_HISTORIES_CURSOR_SESSION_KEY}
        >
          <RecordTable className="w-full">
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.CursorBackwardSkeleton
                handleFetchMore={handleFetchMore}
              />
              {loading && <RecordTable.RowSkeleton rows={40} />}
              <RecordTable.RowList />
              <RecordTable.CursorForwardSkeleton
                handleFetchMore={handleFetchMore}
              />
            </RecordTable.Body>
          </RecordTable>
        </RecordTable.CursorProvider>
      </RecordTable.Provider>
    </div>
  );
};
