import { Skeleton, Separator } from 'erxes-ui';
import { useCourseDetail } from '@/courses/detail/hooks/useCourseDetail';
import { useMemo, Fragment } from 'react';
import dayjs from 'dayjs';

const DEMO_STUDENTS = [
  { id: '1', name: 'Student 1' },
  { id: '2', name: 'Student 2' },
  { id: '3', name: 'Student 3' },
  { id: '4', name: 'Student 4' },
  { id: '5', name: 'Student 5' },
];

export const CourseAttendances = () => {
  const { courseDetail, loading } = useCourseDetail();
  const { startDate, endDate } = courseDetail || {};

  // Helper to get all dates between startDate and endDate
  const dateList = useMemo(() => {
    if (!startDate || !endDate) return [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  }, [startDate, endDate]);

  // Generate random attendance data for demo
  const getRandomAttendance = () => Math.random() > 0.3;

  if (loading) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Separator />
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-1">Student</div>
        {dateList.map((date) => (
          <div key={date.toString()} className="col-span-1 text-center">
            {dayjs(date).format('DD/MM/YYYY')}
          </div>
        ))}
      </div>
      {DEMO_STUDENTS.map((student) => (
        <Fragment key={student.id}>
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-1">{student.name}</div>
            {dateList.map((date) => (
              <div key={date.toString()} className="col-span-1 text-center">
                {getRandomAttendance() ? 'Present' : 'Absent'}
              </div>
            ))}
          </div>
          <Separator />
        </Fragment>
      ))}
    </div>
  );
};
