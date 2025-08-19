export interface ICycle {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isEnd: boolean;
  teamId: string;
  createdAt: Date;
  updatedAt: Date;
}
