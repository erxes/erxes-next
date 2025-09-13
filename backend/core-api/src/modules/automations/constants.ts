export const ACTIONS = {
  WAIT: 'delay',
  IF: 'if',
  SET_PROPERTY: 'setProperty',
  SEND_EMAIL: 'sendEmail',
};

export const EMAIL_RECIPIENTS_TYPES = [
  {
    type: 'customMail',
    name: 'customMails',
    label: 'Custom Mails',
  },
  {
    type: 'attributionMail',
    name: 'attributionMails',
    label: 'Attribution Mails',
  },
  {
    type: 'segmentBased',
    name: 'segmentBased',
    label: 'Trigger Segment Based Mails',
  },
  {
    type: 'teamMember',
    name: 'teamMemberIds',
    label: 'Team Members',
  },
  {
    type: 'lead',
    name: 'leadIds',
    label: 'Leads',
  },
  {
    type: 'customer',
    name: 'customerIds',
    label: 'Customers',
  },
  {
    type: 'company',
    name: 'companyIds',
    label: 'Companies',
  },
];

export const UI_ACTIONS = [
  {
    type: 'outgoingWebhook',
    icon: 'IconWebhook',
    label: 'Outgoing webhook',
    description: 'Outgoing webhook',
    isAvailable: true,
  },
  {
    type: 'if',
    icon: 'IconSitemap',
    label: 'Branches',
    description: 'Create simple or if/then branches',
    isAvailable: true,
  },
  {
    type: 'setProperty',
    icon: 'IconFlask',
    label: 'Manage properties',
    description:
      'Update existing default or custom properties for Contacts, Companies, Cards, Conversations',
    isAvailable: true,
  },
  {
    type: 'delay',
    icon: 'IconHourglass',
    label: 'Delay',
    description:
      'Delay the next action with a timeframe, a specific event or activity',
    isAvailable: true,
  },
  {
    type: 'workflow',
    icon: 'IconJumpRope',
    label: 'Workflow',
    description:
      'Enroll in another workflow,  trigger outgoing webhook or write custom code',
    isAvailable: false,
  },
  {
    type: 'sendEmail',
    icon: 'IconMailFast',
    label: 'Send Email',
    description: 'Send Email',
    emailRecipientsConst: EMAIL_RECIPIENTS_TYPES,
    isAvailable: true,
  },
  {
    type: 'waitEvent',
    icon: 'IconClockPlay',
    label: 'Wait event',
    description: 'Delay until event is triggered',
    isAvailable: true,
  },
  {
    type: 'aiAgent',
    icon: 'IconAi',
    label: 'Ai Agent',
    description:
      'Handle workflow conversations by topic using AI agents with embedded knowledge',
    isAvailable: true,
  },
];

export const UI_TRIGGERS = [
  {
    type: 'core:incoming_webhook',
    icon: 'IconWebhook',
    label: 'Incoming Webhook',
    description:
      'Trigger automation workflows when external systems send HTTP requests to your webhook endpoint',
    isCustom: true,
  },
  {
    type: 'core:user',
    icon: 'IconUsers',
    label: 'Team member',
    description:
      'Start with a blank workflow that enrolls and is triggered off team members',
  },
  {
    type: 'core:customer',
    icon: 'IconUsersGroup',
    label: 'Customer',
    description:
      'Start with a blank workflow that enrolls and is triggered off Customers',
  },
  {
    type: 'core:lead',
    icon: 'IconUsersGroup',
    label: 'Lead',
    description:
      'Start with a blank workflow that enrolls and is triggered off Leads',
  },
  {
    type: 'core:company',
    icon: 'IconBuilding',
    label: 'Company',
    description:
      'Start with a blank workflow that enrolls and is triggered off company',
  },
  {
    type: 'core:form_submission',
    icon: 'IconForms',
    label: 'Form submission',
    description:
      'Start with a blank workflow that enrolls and is triggered off form submission',
  },
];
