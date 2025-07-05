export interface IIntegration {
  _id: string;
  name: string;
  kind: string;
  brandId: string;
  channelIds?: string[];
}

export interface IIntegrationDetail extends IIntegration {
  brandId: string;
  isActive: boolean;
  healthStatus: {
    status: 'healthy' | string;
  };
}

export interface IIntegrationType {
  _id: string;
  name: string;
}
