import { Input, Label, Skeleton, Slider, Switch } from 'erxes-ui';
import { useCourseDetail } from '@/courses/detail/hooks/useCourseDetail';

export const CourseDetailGeneral = () => {
  const { courseDetail, loading } = useCourseDetail();
  const { status, class: courseClass, location } = courseDetail || {};

  if (loading) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <div className="space-y-8 p-6 overflow-y-auto h-[900px] bg-white rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <Label
            htmlFor="class"
            className="text-xs font-semibold text-gray-500 tracking-wider mb-1"
          >
            Class
          </Label>
          <Input
            id="classId"
            defaultValue={courseClass?.name}
            onChange={(e) => console.log('classId', e.target.value)}
            className="w-full rounded-md border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="location"
            className="text-xs font-semibold text-gray-500 tracking-wider mb-1"
          >
            Location
          </Label>
          <Input
            id="location"
            defaultValue={location}
            onChange={(e) => console.log('location', e.target.value)}
            className="w-full rounded-md border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
          />
        </div>
        <div className="space-y-2">
          <div className="flex flex-col items-start">
            <Label
              htmlFor="status"
              className="text-xs font-semibold text-gray-500 tracking-wider mb-1"
            >
              Status
            </Label>
            <Switch
              className="scale-150 mt-2 ml-2"
              checked={status}
              onCheckedChange={(checked) => {
                console.log('checked');
              }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="enrollment"
            className="text-xs font-semibold text-gray-500 tracking-wider mb-1"
          >
            Enrollment
          </Label>
          <div className="flex items-center gap-3">
            <Slider hideThumb max={100} defaultValue={[80]} step={1} />
            <span className="text-primary font-semibold">{80}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
