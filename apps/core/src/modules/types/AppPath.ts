export enum AppPath {
  Index = '/',
  Inbox = 'inbox',
  InboxCatchAll = `/${Inbox}/*`,
  Settings = 'settings',
  SettingsCatchAll = `/${Settings}/*`,
  Products = 'products',
  ProductsCatchAll = `/${Products}/*`,
  Contacts = 'contacts',
  ContactsCatchAll = `/${Contacts}/*`,
}
