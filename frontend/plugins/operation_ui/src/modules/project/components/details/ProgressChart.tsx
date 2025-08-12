import { ChartContainer, ChartConfig, Card } from 'erxes-ui';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { useGetProjectProgressChart } from '~/modules/project/hooks/useGetProjectProgressChart';
import { format, parseISO } from 'date-fns';

export const ProgressChart = ({ projectId }: { projectId: string }) => {
  const chartConfig = {
    started: {
      label: 'Started',
      color: 'hsl(var(--chart-1))',
    },
    completed: {
      label: 'Completed',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  const { getProjectProgressChart = [] } = useGetProjectProgressChart({
    variables: { _id: projectId },
  });

  const chartData = getProjectProgressChart?.chartData || [];

  return (
    <Card>
      <Card.Content>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => format(parseISO(value), 'M d')}
            />

            <Line
              dataKey="started"
              type="monotone"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="completed"
              type="monotone"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </Card.Content>
    </Card>
  );
};
