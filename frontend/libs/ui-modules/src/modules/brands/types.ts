export interface IBrand {
  _id: string;
  code: string;
  createdAt: Date;
  description: string;
  memberIds: string[];
  name: string;
  userId: string;
  emailConfig: any;
}

export enum BrandsHotKeyScope {
  BrandsSettingsPage = 'brands-page',
  BrandsCreateSheet = 'add-brand',
}

export interface IBrandSelectContext {
  selectedBrandId: string | undefined;
  selectedBrand: IBrand | undefined;
  setSelectedBrandId?: (id: string) => void;
  onSelect?: (brand: IBrand) => void;
}
