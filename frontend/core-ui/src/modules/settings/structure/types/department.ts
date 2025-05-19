import { IMember } from 'ui-modules';

export interface IDepartmentListItem {
  _id: string;
  code: string;
  title: string;
  supervisorId: string;
  supervisor?: IMember;
  userCount: number;
}
