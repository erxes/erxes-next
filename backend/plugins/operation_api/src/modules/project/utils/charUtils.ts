import { addDays, differenceInCalendarDays } from 'date-fns';

export const fillUntilTargetDate = (
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

export const fillMissingDays = (
  data: { date: Date; started: number; completed: number }[],
  baseDate: Date,
  totalDays = 7,
) => {
  const filledData: { date: Date; started: number; completed: number }[] = [];

  const mapDateToData = new Map(
    data.map((item) => [new Date(item.date).toDateString(), item]),
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

export const fillFromLastDate = (
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

export const fillMissingDaysWithStartDate = (
  data: { date: Date; started: number; completed: number }[],
  startDate: Date,
  totalDays = 7,
) => {
  const filledData: { date: Date; started: number; completed: number }[] = [];

  const mapDateToData = new Map(
    data.map((item) => [new Date(item.date).toDateString(), item]),
  );

  for (let i = 0; i < totalDays; i++) {
    const date = addDays(startDate, i);
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
