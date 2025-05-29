import { IBrand } from 'ui-modules';

export interface IIntegration {
  _id: string;
  name: string;
  kind: string;
  brand?: Partial<IBrand>;
}
