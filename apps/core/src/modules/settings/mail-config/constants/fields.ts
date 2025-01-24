export const mailServiceFields = {
  SES: {
    name: "AWS SES",
    fields: [
      { label: 'AWS SES Access Key Id', name: 'AWS_SES_ACCESS_KEY_ID', type: 'text' },
      { label: 'AWS SES Secret Access Key', name: 'AWS_SES_SECRET_ACCESS_KEY', type: 'text' },
      { label: 'AWS Region', name: 'AWS_REGION', type: 'text' },
      { label: 'AWS Config Set', name: 'AWS_SES_CONFIG_SET', type: 'text' },
    ],
  },
  custom: {
    name: "Custom",
    fields: [
      { label: 'Mail Service Name', name: 'MAIL_SERVICE', type: 'text' },
      { label: 'Port', name: 'MAIL_PORT', type: 'text' },
      { label: 'Username', name: 'MAIL_USER', type: 'text' },
      { label: 'Password', name: 'MAIL_PASS', type: 'text' },
      { label: 'Host', name: 'MAIL_HOST', type: 'text' },
    ]
  },
};