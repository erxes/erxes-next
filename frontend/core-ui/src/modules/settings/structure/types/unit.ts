import { IMember } from 'ui-modules';

export interface IUnitListItem {
  _id: string;
  code: string;
  title: string;
  departmentId: string;
  supervisorId: string;
  supervisor?: IMember;
  userCount: number;
}
