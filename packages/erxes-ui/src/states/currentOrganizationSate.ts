import { createState } from './createState';

export type CurrentOrganization = {
  _id: string;
  name: string;
  subdomain: string;
  haveOwner?: boolean;
};

export const currentOrganizationState = createState<CurrentOrganization | null>(
  {
    key: 'currentOrganizationState',
    defaultValue: null,
  }
);
