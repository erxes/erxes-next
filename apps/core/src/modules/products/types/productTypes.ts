export type ProductT = {
  _id: string;
  name: string;
  unitPrice: number;
  code: string;
  categoryId: string;
  tagIds: string[];
};

export type ProductCategoryT = {
  _id: string;
  name: string;
};
