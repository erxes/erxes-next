export interface IPosition {
  _id: string;
  children: {
    _id: string;
    code: string;
    title: string;
    userCount: number;
  };
  code: string;
  order: string;
  parentId: string;
  status: string;
  title: string;
  userCount: number;
}
export interface IPositionContext {
  selectedPosition: IPosition | undefined;
  setSelectedPosition: (position: IPosition) => void;
}
