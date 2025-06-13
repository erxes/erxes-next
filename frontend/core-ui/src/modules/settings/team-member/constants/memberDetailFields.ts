import {
  Icon,
  IconBrandDiscord,
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandX,
  IconProps,
  IconWorldWww,
} from '@tabler/icons-react';

interface IDetailField {
  label: string;
  name: string;
  placeholder: string;
  attributeType:
    | 'text'
    | 'email'
    | 'tel'
    | 'date'
    | 'numeric'
    | 'textfield'
    | 'select';
  path?: string | undefined;
  description?: string;
}

interface ILinkField {
  label: string;
  name: string;
  path: string;
  Icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
}

export const USER_DETAIL_FIELDS: IDetailField[] = [
  {
    label: 'First name',
    name: 'firstName',
    placeholder: 'First Name',
    attributeType: 'text',
    path: 'details',
    description: 'First name',
  },
  {
    label: 'Middle name',
    name: 'middleName',
    placeholder: 'Middle Name',
    attributeType: 'text',
    path: 'details',
    description: 'Middle name',
  },
  {
    label: 'Last name',
    name: 'lastName',
    placeholder: 'Last Name',
    attributeType: 'text',
    path: 'details',
    description: 'Last name',
  },
  {
    label: 'Short name',
    name: 'shortName',
    placeholder: 'Short Name',
    attributeType: 'text',
    path: 'details',
    description: 'Short name',
  },
  {
    label: 'Email',
    name: 'email',
    placeholder: 'Email',
    attributeType: 'email',
    description: 'Email',
  },
  {
    label: 'Username',
    name: 'username',
    placeholder: 'Username',
    attributeType: 'text',
    description: 'Username',
  },
  {
    label: 'Description',
    name: 'description',
    placeholder: 'Description',
    attributeType: 'textfield',
    path: 'details',
    description: 'Description',
  },
  {
    label: 'Employee Id',
    name: 'employeeId',
    placeholder: 'Employee Id',
    attributeType: 'text',
    description: 'Employee Id',
  },
  {
    label: 'Positions',
    name: 'positionIds',
    placeholder: 'Positions',
    attributeType: 'text',
    description: 'Positions',
  },
  {
    label: 'Birth date',
    name: 'birthDate',
    placeholder: 'Birth date',
    attributeType: 'date',
    path: 'details',
    description: 'Birth date',
  },
  {
    label: 'Location',
    name: 'location',
    placeholder: 'Location',
    attributeType: 'select',
    path: 'details',
    description: 'Location',
  },
  {
    label: 'Join date',
    name: 'workStartedDate',
    placeholder: 'Join date',
    attributeType: 'date',
    path: 'details',
    description: 'Join date',
  },
];

export const USER_LINK_FIELDS: ILinkField[] = [
  {
    label: 'Facebook',
    name: 'facebook',
    path: 'links',
    Icon: IconBrandFacebook,
  },
  {
    label: 'Twitter',
    name: 'twitter',
    path: 'links',
    Icon: IconBrandX,
  },
  {
    label: 'Website',
    name: 'website',
    path: 'links',
    Icon: IconWorldWww,
  },
  {
    label: 'Discord',
    name: 'discord',
    path: 'links',
    Icon: IconBrandDiscord,
  },
  {
    label: 'GitHub',
    name: 'github',
    path: 'links',
    Icon: IconBrandGithub,
  },
  {
    label: 'Instagram',
    name: 'instagram',
    path: 'links',
    Icon: IconBrandInstagram,
  },
];
