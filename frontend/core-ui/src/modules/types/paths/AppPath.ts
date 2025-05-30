export enum AppPath {
  //auth
  Login = '/login',
  ResetPassword = '/reset-password',
  CreateOwner = '/create-owner',
  ForgotPassword = '/forgot-password',

  //main
  Index = '/',
  Settings = 'settings',
  SettingsCatchAll = `/${Settings}/*`,

  Products = 'products',
  ProductsCatchAll = `/${Products}/*`,

  Contacts = 'contacts',
  ContactsCatchAll = `/${Contacts}/*`,
  Segments = 'segments',
  SegmentsCatchAll = `/${Segments}/*`,
  Automations = 'automations',
  AutoamtionsCatchAll = `/${Automations}/*`,
  Logs = 'logs',
  LogsCatchAll = `/${Logs}/*`,
  Marketplace = 'marketplace',
  MarketplaceCatchAll = `/${Marketplace}/*`,

  //not found

  NotFoundWildcard = '/*',
  NotFound = '/not-found',
}
