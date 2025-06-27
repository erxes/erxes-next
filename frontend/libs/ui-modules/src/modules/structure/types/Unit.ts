export interface IUnit {
  _id: string;
  title: string;
  code: string;
  userCount: number;
}

export interface IUnitsMain {
  list: IUnit[];
  totalCount: number | undefined;
  totalUsersCount: number | undefined;
}

export interface IUnitContext {
  selectedUnit: IUnit | undefined;
  setSelectedUnit: (unit: IUnit) => void;
}
