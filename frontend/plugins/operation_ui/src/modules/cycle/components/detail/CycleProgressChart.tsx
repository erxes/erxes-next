import {
  IGetCycleProgressChart,
  useGetCycleProgressChart,
} from '@/cycle/hooks/useGetCycleProgressChart';
import { endOfDay, format, isAfter, parseISO, subDays } from 'date-fns';
import { ChartContainer } from 'erxes-ui';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

export const CycleProgressChart = ({
  cycleId,
  isCompleted,
  statistics,
}: {
  cycleId: string;
  isCompleted: boolean;
  statistics: any;
}) => {
  const statusColors = {
    started: 'hsl(var(--warning))', // in progress
    completed: 'hsl(var(--success))', // done
    totalScope: 'hsl(var(--primary))', // backlog буюу жишээ өнгө
  };

  const chartConfig = {
    started: {
      label: 'Started',
      color: statusColors.started,
    },
    completed: {
      label: 'Completed',
      color: statusColors.completed,
    },
  };

  const { getCycleProgressChart } = useGetCycleProgressChart({
    variables: { _id: cycleId },
    skip: !cycleId || isCompleted,
  });

  const progress =
    getCycleProgressChart || (statistics.chartData as IGetCycleProgressChart);

  const rawData = progress?.chartData || [];
  const totalScopeValue = progress?.totalScope || 0;
  const todayEnd = endOfDay(new Date());
  const yesterdayEnd = endOfDay(subDays(new Date(), 1));

  const chartData = rawData.map((item, index) => {
    if (isAfter(parseISO(item.date), todayEnd)) {
      const { started, completed } = index > 0 ? rawData[index - 1] : { started: 0, completed: 0 };
      
      return {
        ...item,
        totalScope: totalScopeValue,
        started,
        completed,
        startedOpacity: 0.4,
        completedOpacity: 0.4,
        startedFillOpacity: 0.05,
        completedFillOpacity: 0.05,
        future: true,
      };
    }
    return {
      ...item,
      totalScope: totalScopeValue,
      startedOpacity: 1,
      completedOpacity: 1,
      startedFillOpacity: 0.2,
      completedFillOpacity: 0.2,
      future: false,
    };
  });

  chartData.unshift({
    date: yesterdayEnd.toISOString(),
    totalScope: totalScopeValue,
    started: 0,
    completed: 0,
    startedOpacity: 1,
    completedOpacity: 1,
    startedFillOpacity: 0.2,
    completedFillOpacity: 0.2,
    future: false,
  });

  return (
    <div>
      <ChartContainer config={chartConfig}>
        <AreaChart accessibilityLayer data={chartData} margin={{ top: 10 }}>
          <defs>
            <linearGradient id="startedGradient" x1="0" y1="0" x2="1" y2="0">
              {chartData.map((item, index) => {
                const percent = (index / (chartData.length - 1)) * 100;
                const opacity = item.future ? 0.4 : 1;
                return (
                  <stop
                    key={index}
                    offset={`${percent}%`}
                    stopColor={statusColors.started}
                    stopOpacity={opacity}
                  />
                );
              })}
            </linearGradient>
            <linearGradient id="completedGradient" x1="0" y1="0" x2="1" y2="0">
              {chartData.map((item, index) => {
                const percent = (index / (chartData.length - 1)) * 100;
                const opacity = item.future ? 0.4 : 1;
                return (
                  <stop
                    key={index}
                    offset={`${percent}%`}
                    stopColor={statusColors.completed}
                    stopOpacity={opacity}
                  />
                );
              })}
            </linearGradient>
            <linearGradient
              id="startedFillGradient"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              {chartData.map((item, index) => {
                const percent = (index / (chartData.length - 1)) * 100;
                const opacity = item.future ? 0.05 : 0.2;
                return (
                  <stop
                    key={index}
                    offset={`${percent}%`}
                    stopColor={statusColors.started}
                    stopOpacity={opacity}
                  />
                );
              })}
            </linearGradient>
            <linearGradient
              id="completedFillGradient"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              {chartData.map((item, index) => {
                const percent = (index / (chartData.length - 1)) * 100;
                const opacity = item.future ? 0.05 : 0.2;
                return (
                  <stop
                    key={index}
                    offset={`${percent}%`}
                    stopColor={statusColors.completed}
                    stopOpacity={opacity}
                  />
                );
              })}
            </linearGradient>
          </defs>
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
            hide={true}
            allowDecimals={false}
          />
          <Area
            dataKey="totalScope"
            type="monotone"
            stroke={statusColors.totalScope}
            fill={`hsla(var(--primary) / 0.2)`}
            strokeWidth={2}
            connectNulls={true}
            strokeLinecap="round"
            dot={false}
            activeDot={false}
          />
          <Area
            dataKey="started"
            type="monotone"
            stroke="url(#startedGradient)"
            fill="url(#startedFillGradient)"
            strokeWidth={2}
            dot={false}
            connectNulls={true}
            strokeLinecap="round"
          />
          <Area
            dataKey="completed"
            type="monotone"
            stroke="url(#completedGradient)"
            fill="url(#completedFillGradient)"
            strokeWidth={2}
            dot={false}
            connectNulls={true}
            strokeLinecap="round"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};
