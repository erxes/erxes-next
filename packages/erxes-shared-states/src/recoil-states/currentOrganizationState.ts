import { createState } from './createState';

export type CurrentOrganization = {
  name: string;
  hasOwner?: boolean;
  theme?: {
    logo?: string;
    favicon?: string;
  };
  plugins?: {
    name: string;
    url: string;
  }[];
};

export const currentOrganizationState = createState<CurrentOrganization | null>(
  {
    key: 'currentOrganizationState',
    defaultValue: null,
  }
);
