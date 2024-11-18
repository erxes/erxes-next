export enum AppPath {
  Index = '/',
  Inbox = 'inbox',
  InboxCatchAll = `/${Inbox}/*`,
  Settings = 'settings',
  SettingsCatchAll = `/${Settings}/*`,
}
