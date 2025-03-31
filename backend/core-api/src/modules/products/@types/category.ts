export interface IProductCategoryParams {
  parentId: string;
  searchValue: string;
  status: string;
  withChild: boolean;
  brand: string;
  meta: string | number;
  ids: string[];
}
