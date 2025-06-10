import { OperationVariables, useQuery } from '@apollo/client';
import { useSetAtom } from 'jotai';
import { useQueryState } from 'erxes-ui';
import { renderingCourseDetailAtom } from '@/courses/detail/states/courseDetailStates';
import { COURSE_DETAIL } from '@/courses/detail/graphql/queries/courseDetail';

export const useCourseDetail = (operationVariables?: OperationVariables) => {
  const [_id] = useQueryState('courseId');
  const setRendering = useSetAtom(renderingCourseDetailAtom);
  const { data, loading } = useQuery(COURSE_DETAIL, {
    variables: {
      _id,
    },
    skip: !_id,
    ...operationVariables,
    onCompleted: (data) => {
      setRendering(false);
      operationVariables?.onCompleted?.(data);
    },
    onError: (error) => {
      setRendering(false);
      operationVariables?.onError?.(error);
    },
  });

  return { courseDetail: data?.courseDetail, loading };
};
