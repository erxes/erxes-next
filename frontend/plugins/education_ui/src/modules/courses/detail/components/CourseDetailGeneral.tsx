import { Skeleton } from 'erxes-ui';
import { useCourseDetail } from '@/courses/detail/hooks/useCourseDetail';

export const CourseDetailGeneral = () => {
  const { courseDetail, loading } = useCourseDetail();
  const { description } = courseDetail || {};

  if (loading) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <div className="py-8 space-y-6">
      <div className="px-8 space-y-6 font-medium">
        <DataListItem label="Description">{description}</DataListItem>
      </div>
    </div>
  );
};

const DataListItem = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex gap-1 leading-4 items-center">
      <div className="w-32 text-muted-foreground/70">{label}</div>
      {children ? (
        children
      ) : (
        <div className="text-muted-foreground/50 select-none">{'Empty'}</div>
      )}
    </div>
  );
};
