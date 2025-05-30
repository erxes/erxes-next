import { IAttachment } from 'erxes-ui';

export interface IProductCategory {
    _id: string;
    name: string;
    avatar: IAttachment;
    code: string;
    order: string;
    productCount: number;
    parentId: string;
  }
  
  