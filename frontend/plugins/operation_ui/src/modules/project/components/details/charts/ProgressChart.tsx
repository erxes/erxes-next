import { ChartContainer, ChartConfig, Card } from 'erxes-ui';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { useGetProjectProcessChart } from '@/project/hooks/useGetProjectProcessChart';
import { IProject } from '@/project/types';
import { addDays, format, parseISO } from 'date-fns';

export const ProgressChart = ({
  projectId,
  project,
}: {
  projectId: string;
  project: IProject;
}) => {
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

  const { getProjectProgressChart = [] } = useGetProjectProcessChart({
    variables: { _id: projectId },
  });

  const fillMissingDays = (
    data: { date: Date; started: number; completed: number }[],
    baseDate: Date,
    totalDays = 7,
  ) => {
    const filledData = [];
    const mapDateToData = new Map(data.map((item) => [item.date, item]));

    for (let i = 0; i < totalDays; i++) {
      const date = addDays(baseDate, i);

      const item = mapDateToData.get(date);
      if (item) {
        filledData.push(item);
      } else {
        filledData.push({
          date,
          started: 0,
          completed: 0,
        });
      }
    }

    return filledData;
  };

  const fillFromLastDate = (
    data: { date: Date; started: number; completed: number }[],
    totalDays = 7,
  ) => {
    if (data.length === 0) return data;

    const filledData = [...data];
    const lastDate = data[data.length - 1].date;

    for (let i = 1; i <= totalDays - data.length; i++) {
      const nextDate = addDays(lastDate, i);
      filledData.push({
        date: nextDate,
        started: 0,
        completed: 0,
      });
    }

    return filledData;
  };

  let chartData = [];

  if (getProjectProgressChart && getProjectProgressChart.length > 0) {
    if (getProjectProgressChart.length < 7) {
      chartData = fillFromLastDate(getProjectProgressChart, 7);
    } else {
      chartData = getProjectProgressChart;
    }
  } else {
    const baseDate = project.startDate
      ? new Date(project.startDate)
      : new Date(project.createdAt);
    chartData = fillMissingDays([], baseDate, 7);
  }

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
              tickFormatter={(value) => format(value, 'M dd')}
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
