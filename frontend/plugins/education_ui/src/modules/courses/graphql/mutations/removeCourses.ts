import { gql } from '@apollo/client';

export const REMOVE_COURSES = gql`
  mutation CourseRemove($courseIds: [String]) {
    courseRemove(courseIds: $courseIds)
  }
`;
