export type IFacebookBotPersistentMenu = {
  _id: string;
  text: string;
  type: string;
  link: string;
};

export type IFacebookBot = {
  _id: string;
  name: string;
  account: any;
  accountId: string;
  createdAt: string;
  page: any;
  pageId: string;
  profileUrl: string;
  persistentMenus: IFacebookBotPersistentMenu[];
  greetText: string;
  tag: string;
  isEnabledBackBtn: string;
  backButtonText: string;
};
