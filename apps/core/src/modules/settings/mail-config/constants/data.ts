import { IconBrandAws, IconMail } from "@tabler/icons-react";

export const MAIL_SERVICE_TYPES = [
  {
    label: 'AWS SES',
    value: 'SES',
    icon: IconBrandAws
  },
  {
    label: 'Custom',
    value: 'custom',
    icon: IconMail
  },
]

export const MAIL_TEMPLATE_TYPES = [
  { label: 'Simple', value: 'simple' },
  { label: 'Custom', value: 'custom' }
];
