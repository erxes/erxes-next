export type FieldType =
  | 'string'
  | 'Array'
  | 'owner'
  | 'avatar'
  | 'links'
  | 'sex';
type LinkType =
  | 'website'
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'linkedIn'
  | 'github';

interface Field {
  displayName: string | null;
  type: FieldType;
  children?: Array<
    Partial<{ [key in LinkType]: { displayName: string; type: 'string' } }>
  >;
}

interface MergeMapEntry {
  [key: string]: Field;
}

export const MergeMap: MergeMapEntry[] = [
  { avatar: { displayName: 'Avatar', type: 'avatar' } },
  { firstName: { displayName: 'First Name', type: 'string' } },
  { middleName: { displayName: 'Middle Name', type: 'string' } },
  { lastName: { displayName: 'Last Name', type: 'string' } },
  { primaryEmail: { displayName: 'Primary Email', type: 'string' } },
  {
    emailValidationStatus: {
      displayName: 'Email validation Status',
      type: 'string',
    },
  },
  { emails: { displayName: 'Emails', type: 'Array' } },
  { primaryPhone: { displayName: 'Primary Phone', type: 'string' } },
  {
    phoneValidationStatus: {
      displayName: 'Phone validation Status',
      type: 'string',
    },
  },
  { sex: { displayName: 'Sex', type: 'sex' } },
  { phones: { displayName: 'Phones', type: 'Array' } },
  { isSubscribed: { displayName: 'Is Subscribed', type: 'string' } },
  { owner: { displayName: 'Owner', type: 'owner' } },
  {
    links: {
      displayName: null,
      type: 'links',
      children: [
        { website: { displayName: 'Website', type: 'string' } },
        { facebook: { displayName: 'Facebook', type: 'string' } },
        { instagram: { displayName: 'Instagram', type: 'string' } },
        { twitter: { displayName: 'Twitter', type: 'string' } },
        { linkedIn: { displayName: 'LinkedIn', type: 'string' } },
        { github: { displayName: 'Github', type: 'string' } },
      ],
    },
  },
];
