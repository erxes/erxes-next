import { ChartContainer, ChartConfig, Card } from 'erxes-ui';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { useGetProjectProgressChart } from '~/modules/project/hooks/useGetProjectProgressChart';
import { IProject } from '@/project/types';
import { addDays, format, parseISO, differenceInCalendarDays } from 'date-fns';

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

  const { getProjectProgressChart = [] } = useGetProjectProgressChart({
    variables: { _id: projectId },
  });

  // Fill missing days from baseDate for totalDays
  const fillMissingDays = (
    data: { date: Date; started: number; completed: number }[],
    baseDate: Date,
    totalDays = 7,
  ) => {
    const filledData = [];
    const mapDateToData = new Map(
      data.map((item) => [item.date.toDateString(), item]),
    );

    for (let i = 0; i < totalDays; i++) {
      const date = addDays(baseDate, i);
      const item = mapDateToData.get(date.toDateString());
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

  const fillUntilTargetDate = (
    data: { date: Date; started: number; completed: number }[],
    targetDate: Date,
  ) => {
    if (data.length === 0) return data;

    const filledData = [...data];
    const lastDate = data[data.length - 1].date;

    const daysToAdd = differenceInCalendarDays(targetDate, lastDate);
    for (let i = 1; i <= daysToAdd; i++) {
      const nextDate = addDays(lastDate, i);
      filledData.push({
        date: nextDate,
        started: 0,
        completed: 0,
      });
    }

    return filledData;
  };

  // Convert your API dates (strings) to Date objects for correct processing
  const dataWithDates = getProjectProgressChart.map((item: any) => ({
    ...item,
    date: parseISO(item.date),
  }));

  const sortedData = dataWithDates.sort(
    (a: any, b: any) => a.date.getTime() - b.date.getTime(),
  );

  let chartData = [];

  if (sortedData.length > 0 && project.targetDate) {
    if (
      new Date(project.targetDate) <
      new Date(sortedData[sortedData.length - 1].date)
    ) {
      chartData = fillFromLastDate(sortedData, 7);
    } else {
      const targetDate = new Date(project.targetDate);

      chartData = fillUntilTargetDate(sortedData, targetDate);
    }
  } else if (sortedData.length > 0 && sortedData.length < 7) {
    chartData = fillFromLastDate(sortedData, 7);
  } else if (sortedData.length > 0) {
    chartData = sortedData;
  } else {
    const baseDate = project.startDate
      ? new Date(project.startDate)
      : new Date(project.createdAt);
    chartData = fillMissingDays([], baseDate, 7);
  }

  const formattedChartData = chartData.map((item: any) => ({
    ...item,
    date: format(item.date, 'yyyy-MM-dd'),
  }));

  return (
    <Card>
      <Card.Content>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={formattedChartData}
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
