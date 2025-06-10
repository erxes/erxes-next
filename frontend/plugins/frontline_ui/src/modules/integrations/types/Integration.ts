export interface IIntegration {
  _id: string;
  name: string;
  kind: string;
  brandId: string;
}

export interface IIntegrationDetail extends IIntegration {
  brandId: string;
  isActive: boolean;
  healthStatus: {
    status: 'success' | 'page-token' | 'account-token';
  };
}

export interface IIntegrationKind {
  _id: string;
  name: string;
}
