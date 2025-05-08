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
  Marketplace = 'marketplace',
  MarketplaceCatchAll = `/${Marketplace}/*`,

  //not found

  NotFoundWildcard = '/*',
  NotFound = '/not-found',
}
