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

export interface BrandsInlineProps {
  brandIds?: string[];
  brands?: IBrand[];
  placeholder?: string;
  updateBrands?: (brands: IBrand[]) => void;
}
