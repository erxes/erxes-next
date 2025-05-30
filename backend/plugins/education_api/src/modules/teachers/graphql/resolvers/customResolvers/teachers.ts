import { ITeacherDocument } from '@/teachers/@types/teachers';

export default {
  user(teacher: ITeacherDocument) {
    return teacher.userId && { __typename: 'User', _id: teacher.userId };
  },
};
