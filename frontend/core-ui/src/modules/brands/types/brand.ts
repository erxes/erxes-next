export interface IBrand {
  _id: string;
  name: string;
  code: string;
}

export interface SelectBrandFetchMoreProps {
  fetchMore: () => void;
  brandsLength: number;
  totalCount: number;
}
