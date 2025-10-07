export interface ICustomer {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface IUser {
  _id: string;
  details: IDetail;
  email?: string;
}

export interface IDetail {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  description?: string;
  location?: string;
  position?: string;
  shortName?: string;
}

export interface IConversation {
  _id: string;
  content: string;
  createdAt: string;
  customer: ICustomer;
  assignedUser?: IUser;
  messages: IMessage[];
}

export interface IBrand {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
}

export interface MessengerProps {
  brandId?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface IBrowserInfo {
  remoteAddress: string;
  region: string;
  countryCode: string;
  city: string;
  country: string;
  url: string;
  hostname: string;
  language: string;
  userAgent: string;
}

export interface RequestBrowserInfoParams {
  source: string;
  postData?: any;
  callback: (browserInfo: IBrowserInfo) => void;
}

export interface IConnection {
  setting: any;
  data: any;
  leadData: any;
  queryVariables: string;
  queryParams: string;
  enabledServices: any;
  browserInfo?: IBrowserInfo;
}

export interface IEngageData {
  content: string;
  kind: string;
  sentAs: string;
  messageId: string;
  brandId: string;
}

export interface IMessengerAppData {
  customer: ICustomer;
  hangoutLink: string;
}

export interface IAttachment {
  name: string;
  url: string;
}

export interface IMessage {
  _id: string;
  conversationId: string;
  user?: IUser;
  customerId?: string;
  content: string;
  contentType?: string;
  dailyStatus?: string;
  createdAt: Date;
  internal?: boolean;
  engageData: IEngageData;
  fromBot?: boolean;
  botData: any;
  messengerAppData: IMessengerAppData;
  attachments: IAttachment[];
}

export interface ISupporter {
  _id: string;
  isActive: boolean;
  iOnline: boolean;
  details: IDetail;
}

export interface IColorDefinition {
  DEFAULT: string;
  foreground: string;
}

export interface IUiOptions {
  primary: IColorDefinition;
  logo: string;
}
