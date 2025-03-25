export interface IDepartment {
  _id: string;
  code: string;
  title: string;
  parentId: string;
  order: number;
}

export interface IDepartmentContext {
  selectedDepartment: IDepartment | undefined;
  setSelectedDepartment: (department: IDepartment) => void;
}
