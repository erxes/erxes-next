import { useCallQueueList } from '@/integrations/call/hooks/useCallQueueList';
import { callConfigAtom } from '@/integrations/call/states/sipStates';
import { formatSeconds } from '@/integrations/call/utils/callUtils';
import { ColumnDef } from '@tanstack/table-core';
import {
  RecordTable,
  RecordTableInlineCell,
  Badge,
  ChartContainer,
  HoverCard,
  Separator,
} from 'erxes-ui';
import { useAtomValue } from 'jotai';
import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';
import { Link } from 'react-router-dom';

export const CallQueueRecordTable = () => {
  const callConfig = useAtomValue(callConfigAtom);
  const { inboxId } = callConfig || {};

  const { callQueueList, loading, error } = useCallQueueList({
    variables: { inboxId },
    skip: !inboxId,
  });

  if (!callConfig) {
    return null;
  }

  return (
    <RecordTable.Provider
      columns={columns}
      data={callQueueList || [{}]}
      className="m-3"
      stickyColumns={['queue']}
    >
      <RecordTable.Scroll>
        <RecordTable>
          <RecordTable.Header />
          <RecordTable.Body>
            {loading ? (
              <RecordTable.RowSkeleton rows={6} />
            ) : (
              <RecordTable.RowList />
            )}
          </RecordTable.Body>
        </RecordTable>
      </RecordTable.Scroll>
    </RecordTable.Provider>
  );
};

const columns: ColumnDef<any>[] = [
  {
    header: 'Queue',
    accessorKey: 'queue',
    size: 240,
    cell: ({ cell }) => {
      const {
        queue,
        queuechairman,
        total_calls,
        answered_calls,
        abandoned_calls,
        abandoned_rate,
        avg_wait,
        avg_talk,
        answered_rate,
      } = cell.row.original;
      return (
        <HoverCard openDelay={100}>
          <HoverCard.Trigger asChild>
            <Link to={`/frontline/calls/${cell.getValue()}`} className="block">
              <RecordTableInlineCell>
                <Badge variant="secondary">
                  {cell.getValue() as string} -{' '}
                  {cell.row.original.queuechairman}
                </Badge>
              </RecordTableInlineCell>
            </Link>
          </HoverCard.Trigger>
          <HoverCard.Content
            sideOffset={4}
            side="right"
            align="start"
            className="w-64 p-0"
          >
            <h4 className="text-sm font-medium p-3">
              {queue} - {queuechairman}
            </h4>
            <Separator />
            <div className="p-3 flex flex-col gap-1 text-sm">
              <div className="grid grid-cols-2 gap-1 pb-3">
                <p className="flex-auto space-y-1 text-center">
                  <span className="text-foreground ml-auto font-semibold flex items-center gap-1">
                    <ProgressChart
                      value={Math.round(abandoned_rate)}
                      variant="destructive"
                    />
                    {Math.round(abandoned_rate)}% of {total_calls}
                  </span>
                  <legend className="text-accent-foreground text-xs">
                    abandoned
                  </legend>
                </p>
                <p className="flex-auto space-y-1 text-center">
                  <span className="text-foreground ml-auto font-semibold flex items-center gap-1">
                    <ProgressChart
                      value={Math.round(answered_rate)}
                      variant="success"
                    />
                    {Math.round(answered_rate)}% of {total_calls}
                  </span>
                  <legend className="text-accent-foreground text-xs">
                    success
                  </legend>
                </p>
              </div>
              <p className="text-sm flex items-center gap-1 justify-between">
                <legend className="text-muted-foreground">total</legend>
                <span className="font-medium">{total_calls}</span>
              </p>
              <p className="text-sm flex items-center gap-1 justify-between">
                <legend className="text-muted-foreground">answered</legend>
                <span className="font-medium">{answered_calls}</span>
              </p>
              <p className="text-sm flex items-center gap-1 justify-between">
                <legend className="text-muted-foreground">abandoned</legend>
                <span className="font-medium">{abandoned_calls}</span>
              </p>
              <p className="text-sm flex items-center gap-1 justify-between">
                <legend className="text-muted-foreground">
                  average wait time
                </legend>
                <span className="font-medium">{formatSeconds(avg_wait)}</span>
              </p>
              <p className="text-sm flex items-center gap-1 justify-between">
                <legend className="text-muted-foreground">
                  average talk time
                </legend>
                <span className="font-medium">{formatSeconds(avg_talk)}</span>
              </p>
            </div>
          </HoverCard.Content>
        </HoverCard>
      );
    },
  },
  {
    header: 'Abandoned rate',
    accessorKey: 'abandoned_rate',
    cell: ({ cell }) => (
      <RecordTableInlineCell className="font-medium">
        <ProgressChart
          value={cell.getValue() as number}
          variant="destructive"
        />
        {Math.round(cell.getValue() as number)}% of{' '}
        {cell.row.original.total_calls}
      </RecordTableInlineCell>
    ),
  },

  {
    header: 'Answered rate',
    accessorKey: 'answered_rate',
    cell: ({ cell, row }) => (
      <RecordTableInlineCell className="font-medium">
        <ProgressChart value={cell.getValue() as number} variant="success" />
        {Math.round(cell.getValue() as number)}% of {row.original.total_calls}
      </RecordTableInlineCell>
    ),
  },
  {
    header: 'Answered calls',
    accessorKey: 'answered_calls',
    cell: ({ cell }) => (
      <RecordTableInlineCell className="font-medium">
        {cell.getValue() as string}
      </RecordTableInlineCell>
    ),
  },
  {
    header: 'Abandoned calls',
    accessorKey: 'abandoned_calls',
    cell: ({ cell }) => (
      <RecordTableInlineCell className="font-medium">
        {cell.getValue() as string}
      </RecordTableInlineCell>
    ),
  },
  {
    header: 'Total calls',
    accessorKey: 'total_calls',
    cell: ({ cell }) => (
      <RecordTableInlineCell className="font-medium">
        {cell.getValue() as string}
      </RecordTableInlineCell>
    ),
  },
  {
    header: 'Average wait time',
    accessorKey: 'avg_wait',
    cell: ({ cell }) => (
      <RecordTableInlineCell className="font-medium">
        {formatSeconds(cell.getValue() as number)}
      </RecordTableInlineCell>
    ),
  },
  {
    header: 'Average talk time',
    accessorKey: 'avg_talk',
    cell: ({ cell }) => (
      <RecordTableInlineCell className="font-medium">
        {formatSeconds(cell.getValue() as number)}
      </RecordTableInlineCell>
    ),
  },
];

export const ProgressChart = ({
  value,
  variant = 'primary',
}: {
  value: number;
  variant?: 'primary' | 'destructive' | 'success' | 'warning' | 'info';
}) => {
  return (
    <ChartContainer config={{}} className="aspect-square size-6">
      <RadialBarChart
        width={24}
        height={24}
        cx={12}
        cy={12}
        innerRadius={6}
        outerRadius={10}
        data={[
          {
            name: 'Progress',
            value: value,
            fill: `hsl(var(--${variant}))`,
          },
        ]}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          background={{ fill: 'hsl(var(--border))' }}
          dataKey="value"
          cornerRadius={10}
        />
      </RadialBarChart>
    </ChartContainer>
  );
};

// {
//   "queuechairman": "admin",0
//   "queue": 6501,0
//   "total_calls": 18,0
//   "answered_calls": 10,0
//   "answered_rate": 55.560001,0
//   "abandoned_calls": 8,0
//   "avg_wait": 10,0
//   "avg_talk": 16,0
//   "vq_total_calls": 0,
//   "sla_rate": 0,
//   "vq_sla_rate": 0,
//   "transfer_out_calls": 0,
//   "transfer_out_rate": 0,
//   "abandoned_rate": 44.439999
// }
