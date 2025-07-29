import { PaymentKind } from "~/modules/payment/types/PaymentMethods";

export const PAYMENTS = {
  [PaymentKind.QPAY]: {
    name: 'Qpay',
    description:
      'Connect your existing Qpay account to Erxes',
    active: true,
    inputs: [
        { key: 'qpayMerchantUser', label: 'Username' },
        { key: 'qpayMerchantPassword', label: 'Password', type: 'password' },
        { key: 'qpayInvoiceCode', label: 'Invoice code' },
      ],
  },
  [PaymentKind.QUICKQR]: {
    name: 'Qpay Quick QR',
    description:
      'Connect your bank account to Qpay',
    active: true,
  },
  [PaymentKind.SOCIALPAY]: {
    name: 'Social Pay',
    description: 'Fast and easy way to receive payments',
    active: true,
    inputs: [
        { key: 'inStoreSPTerminal', label: 'Terminal' },
        { key: 'inStoreSPKey', label: 'Key', type: 'password' },
      ],
},
  [PaymentKind.MONPAY]: {
    name: 'MonPay',
    description: 'Easy, fast and reliable payment by QR scan',
    active: true,
    inputs: [
        { key: 'username', label: 'Branch username' },
        { key: 'accountId', label: 'Account ID', type: 'password' },
      ],
  },
  [PaymentKind.STOREPAY]: {
    name: 'StorePay',
    description: 'Connect your StorePay merchant account.',
    active: true,

    inputs: [
        { key: 'storeId', label: 'Store id' },
        { key: 'merchantUsername', label: 'Merchant username' },
        { key: 'merchantPassword', label: 'Merchant password', type: 'password' },
        { key: 'appUsername', label: 'App username' },
        { key: 'appPassword', label: 'App password', type: 'password' },
      ],
  },
  [PaymentKind.POCKET]: {
    name: 'Pocket',
    description: 'Connect your Pocket merchant account.',
    active: true,
    inputs: [
        { key: 'pocketMerchant', label: 'Merchant' },
        { key: 'pocketClientId', label: 'Client ID' },
        { key: 'pocketClientSecret', label: 'Client secret', type: 'password' },
      ],
  },
  [PaymentKind.WECHATPAY]: {
    name: 'Qpay Wechat Pay',
    description: 'Receive payments in Mongolia through the WeChat Pay',
    active: true,
    inputs: [
        { key: 'username', label: 'Username' },
        { key: 'password', label: 'Password', type: 'password' },
        { key: 'terminal', label: 'Terminal code' },
      ],
  },
  [PaymentKind.MINUPAY]: {
    name: 'Minupay',
    description: 'Connect your Minupay merchant account.',
    active: true,
    inputs: [
        { key: 'username', label: 'Username' },
        { key: 'password', label: 'Password', type: 'password' },
      ],
  },
  [PaymentKind.GOLOMT]: {
    name: 'Golomt Card',
    description: 'Connect your Golomt e-commerce account.',
    active: true,
    inputs: [
        { key: 'merchant', label: 'Merchant' },
        { key: 'key', label: 'Key' },
        { key: 'token', label: 'Token', type: 'password' },
      ],
  },
  [PaymentKind.STRIPE]: {
    name: 'Stripe',
    description: 'Accepts most type of domestic and foreign card.',
    active: true,
    inputs: [
        { key: 'publishableKey', label: 'Publishable key' },
        { key: 'secretKey', label: 'Secret key', type: 'password' },
      ],
  },
  [PaymentKind.KAHNBANK]: {
    name: 'Khanbank',
    description: 'Connect your Khanbank Corporate Gateway account.',
    active: true,
  },
};
