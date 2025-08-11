import { ChartContainer, ChartConfig, Card } from 'erxes-ui';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

export const ProgressChart = ({ projectId }: { projectId: string }) => {
  const chartData = [
    { date: 'January', started: 186, completed: 80 },
    { date: 'February', started: 305, completed: 200 },
    { date: 'March', started: 237, completed: 120 },
    { date: 'April', started: 73, completed: 190 },
    { date: 'May', started: 209, completed: 130 },
    { date: 'June', started: 214, completed: 140 },
  ];

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
              tickFormatter={(value) => value.slice(0, 3)}
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
