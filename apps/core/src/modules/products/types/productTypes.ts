export type ProductT = {
  _id: string;
  name: string;
  unitPrice: number;
  code: string;
  categoryId: string;
  tagIds: string[];
  uom: string;
  type: 'product' | 'service' | 'unique' | 'subscription';
};

export type ProductCategoryT = {
  _id: string;
  name: string;
};
