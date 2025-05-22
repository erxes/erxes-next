import { Skeleton, useQueryState } from 'erxes-ui';
import { useCourseComments } from '@/courses/hooks/useCourseComments';

export const CourseComments = () => {
  const [courseId] = useQueryState<string>('courseId');
  const { courseComments, loading } = useCourseComments(courseId);

  if (loading) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <div className="flex flex-col gap-4 m-4">
      {courseComments?.map((comment) => (
        <div key={comment._id} className="p-4 rounded-lg bg-blue-50">
          {/* <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">created by</span>
          </div> */}
          <p className="font-medium">{comment.content}</p>
          <div className="flex justify-end">
            <span className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
