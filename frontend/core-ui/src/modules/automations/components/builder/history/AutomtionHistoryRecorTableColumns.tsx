import { AutomationHistoryDetail } from '@/automations/components/builder/history/components/AutomationHistoryDetail';
import { STATUSES_BADGE_VARIABLES } from '@/automations/constants';
import { StatusBadgeValue } from '@/automations/types';
import { RenderPluginsComponentWrapper } from '@/automations/utils/RenderPluginsComponentWrapper';
import { IconCalendarTime, IconInfoTriangle } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import dayjs from 'dayjs';
import {
  Badge,
  isEnabled,
  RecordTable,
  RecordTableCellDisplay,
  RelativeDateDisplay,
} from 'erxes-ui';
import {
  getAutomationTypes,
  IAction,
  IAutomationHistory,
  ITrigger,
} from 'ui-modules';
import { RenderPluginsComponent } from '~/plugins/components/RenderPluginsComponent';

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
      const [pluginName, moduleName] = getAutomationTypes(triggerType);

      if (pluginName !== 'core' && moduleName) {
        return (
          <RenderPluginsComponentWrapper
            pluginName={pluginName}
            moduleName={moduleName}
            props={{
              componentType: 'historyName',
              triggerType,
              target,
            }}
          />
        );
      }

      if (pluginName && moduleName) {
        return (
          <p className="flex flex-row gap-2 items-center ml-4">
            {pluginName}
            {moduleName}
            <IconInfoTriangle className="size-3 text-destructive" />
          </p>
        );
      }

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
          {triggerLabel || triggerType || 'Empty'}
        </RecordTableCellDisplay>
      );
    },
  },

  {
    id: 'status',
    accessorKey: 'status',
    header: () => <RecordTable.InlineHead label="Status" />,
    cell: ({ cell }) => {
      const status = cell.getValue() as IAutomationHistory['status'];

      const variant: StatusBadgeValue = STATUSES_BADGE_VARIABLES[status];

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
