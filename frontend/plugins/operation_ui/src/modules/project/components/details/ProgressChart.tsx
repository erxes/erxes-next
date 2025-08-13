import { ChartContainer, ChartConfig } from 'erxes-ui';
import { CartesianGrid, XAxis, AreaChart, Area, YAxis } from 'recharts';
import { useGetProjectProgressChart } from '~/modules/project/hooks/useGetProjectProgressChart';
import { format, parseISO, endOfDay, isAfter } from 'date-fns';

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

  const { getProjectProgressChart } = useGetProjectProgressChart({
    variables: { _id: projectId },
  });

  const rawData = getProjectProgressChart?.chartData || [];
  const totalScopeValue = getProjectProgressChart?.totalScope || 0;

  const todayEnd = endOfDay(new Date());

  const chartData = rawData.map((item) => {
    if (isAfter(parseISO(item.date), todayEnd)) {
      return {
        ...item,
        totalScope: totalScopeValue,
        started: null,
        completed: null,
      };
    }
    return { ...item, totalScope: totalScopeValue };
  });

  return (
    <div>
      <ChartContainer config={chartConfig}>
        <AreaChart accessibilityLayer data={chartData} margin={{ top: 10 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => format(parseISO(value), 'MMM d')}
          />
          <YAxis
            domain={[0, totalScopeValue]}
            hide={true} // хэрэв харагдахгүй байхыг хүсвэл
            allowDecimals={false}
          />
          <Area
            dataKey="totalScope"
            type="monotone"
            stroke="hsl(var(--chart-3))"
            fill="hsl(var(--chart-3) / 0.15)"
            strokeWidth={2}
            connectNulls={true}
            strokeLinecap="round"
            dot={false}
            activeDot={false}
          />
          <Area
            dataKey="started"
            type="monotone"
            stroke="hsl(var(--chart-1))"
            fill="hsl(var(--chart-1) / 0.15)"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
            strokeLinecap="round"
          />
          <Area
            dataKey="completed"
            type="monotone"
            stroke="hsl(var(--chart-2))"
            fill="hsl(var(--chart-2) / 0.15)"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
            strokeLinecap="round"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};
