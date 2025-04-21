export interface IDepartment {
  _id: string;
  code: string;
  title: string;
  parentId: string;
  order: string;
  userCount: number;
}

export interface IDepartmentContext {
  selectedDepartment: IDepartment | undefined;
  setSelectedDepartment: (department: IDepartment) => void;
}
