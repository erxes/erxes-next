import { IBrand } from 'ui-modules';

export interface IIntegration {
  _id: string;
  name: string;
  kind: string;
  brand?: Partial<IBrand>;
}

export interface IIntegrationDetail extends IIntegration {
  brandId: string;
  isActive: boolean;
  healthStatus: {
    status: 'success' | 'page-token' | 'account-token';
  };
}
