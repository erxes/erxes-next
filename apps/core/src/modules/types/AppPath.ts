export enum AppPath {
  Index = '/',
  Inbox = 'plugin_inbox',
  InboxCatchAll = `/${Inbox}/*`,
  Settings = 'settings',
  SettingsCatchAll = `/${Settings}/*`,
  Products = 'products',
  ProductsCatchAll = `/${Products}/*`,
  Contacts = 'contacts',
  ContactsCatchAll = `/${Contacts}/*`,
  Marketplace = 'marketplace',
  MarketplaceCatchAll = `/${Marketplace}/*`,
}
