export interface IBrand {
  _id: string;
  name: string;
}

export interface SelectBrandFetchMoreProps {
    fetchMore: () => void;
    brandsLength: number;
    totalCount: number;
}
