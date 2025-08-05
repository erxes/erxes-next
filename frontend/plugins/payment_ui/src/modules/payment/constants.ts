import { PaymentKind } from "~/modules/payment/types/PaymentMethods";

export const PAYMENT_KINDS = {
  [PaymentKind.QPAY]: {
    name: 'Qpay',
    description:
      'Connect your existing Qpay account to Erxes',
    active: true,
    fields: [
        { key: 'qpayMerchantUser', label: 'Username', validation: { type: 'minLength', value: 1 } },
        { key: 'qpayMerchantPassword', label: 'Password', type: 'password', validation: { type: 'minLength', value: 1 } },
        { key: 'qpayInvoiceCode', label: 'Invoice code', validation: { type: 'minLength', value: 1 } },
      ],
  },
  [PaymentKind.QUICKQR]: {
    name: 'Qpay Quick QR',
    description:
      'Connect your bank account to Qpay',
    active: true,
    fields: []
  },
  [PaymentKind.SOCIALPAY]: {
    name: 'Social Pay',
    description: 'Fast and easy way to receive payments',
    active: true,
    fields: [
        { key: 'inStoreSPTerminal', label: 'Terminal', validation: { type: 'minLength', value: 1 } },
        { key: 'inStoreSPKey', label: 'Key', type: 'password', validation: { type: 'minLength', value: 1 } },
      ],
},
  [PaymentKind.MONPAY]: {
    name: 'MonPay',
    description: 'Easy, fast and reliable payment by QR scan',
    active: true,
    fields: [
        { key: 'username', label: 'Branch username', validation: { type: 'minLength', value: 1 } },
        { key: 'accountId', label: 'Account ID', type: 'password', validation: { type: 'minLength', value: 1 } },
      ],
  },
  [PaymentKind.STOREPAY]: {
    name: 'StorePay',
    description: 'Connect your StorePay merchant account.',
    active: true,

    fields: [
        { key: 'storeId', label: 'Store id', validation: { type: 'minLength', value: 1 } },
        { key: 'merchantUsername', label: 'Merchant username', validation: { type: 'minLength', value: 1 } },
        { key: 'merchantPassword', label: 'Merchant password', type: 'password', validation: { type: 'minLength', value: 1 } },
        { key: 'appUsername', label: 'App username', validation: { type: 'minLength', value: 1 } },
        { key: 'appPassword', label: 'App password', type: 'password', validation: { type: 'minLength', value: 1 } },
      ],
  },
  [PaymentKind.POCKET]: {
    name: 'Pocket',
    description: 'Connect your Pocket merchant account.',
    active: true,
    fields: [
        { key: 'pocketMerchant', label: 'Merchant', validation: { type: 'minLength', value: 1 } },
        { key: 'pocketClientId', label: 'Client ID', validation: { type: 'minLength', value: 1 } },
        { key: 'pocketClientSecret', label: 'Client secret', type: 'password', validation: { type: 'minLength', value: 1 } },
      ],
  },
  [PaymentKind.WECHATPAY]: {
    name: 'Qpay Wechat Pay',
    description: 'Receive payments in Mongolia through the WeChat Pay',
    active: true,
    fields: [
        { key: 'username', label: 'Username', validation: { type: 'minLength', value: 1 } },
        { key: 'password', label: 'Password', type: 'password', validation: { type: 'minLength', value: 1 } },
        { key: 'terminal', label: 'Terminal code', validation: { type: 'minLength', value: 1 } },
      ],
  },
  [PaymentKind.MINUPAY]: {
    name: 'Minupay',
    description: 'Connect your Minupay merchant account.',
    active: true,
    fields: [
        { key: 'username', label: 'Username', validation: { type: 'minLength', value: 1 } },
        { key: 'password', label: 'Password', type: 'password', validation: { type: 'minLength', value: 1 } },
      ],
  },
  [PaymentKind.GOLOMT]: {
    name: 'Golomt Card',
    description: 'Connect your Golomt e-commerce account.',
    active: true,
    fields: [
        { key: 'merchant', label: 'Merchant', validation: { type: 'minLength', value: 1 } },
        { key: 'key', label: 'Key', validation: { type: 'minLength', value: 1 } },
        { key: 'token', label: 'Token', type: 'password', validation: { type: 'minLength', value: 1 } },
      ],
  },
  [PaymentKind.STRIPE]: {
    name: 'Stripe',
    description: 'Accepts most type of domestic and foreign card.',
    active: true,
    fields: [
        { key: 'publishableKey', label: 'Publishable key', validation: { type: 'minLength', value: 1 } },
        { key: 'secretKey', label: 'Secret key', type: 'password', validation: { type: 'minLength', value: 1 } },
      ],
  },
  [PaymentKind.KAHNBANK]: {
    name: 'Khanbank',
    description: 'Connect your Khanbank Corporate Gateway account.',
    active: true,
    fields: []
  },
};
