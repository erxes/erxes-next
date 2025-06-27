export interface IBranchUser {
  _id: string;
  details: {
    avatar: string;
    fullName: string;
    __typename: string;
  };
  __typename: string;
}

export interface IBranch {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  token: string;
  erxesAppToken: string;
  user1Ids: string[];
  user2Ids: string[];
  generalManagerIds: string[];
  managerIds: string[];
  paymentIds: string[];
  paymentTypes: string[];
  user: IBranchUser;
  uiOptions: any;
  permissionConfig: any;
  __typename: string;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  details: {
    avatar: string;
    fullName: string;
    shortName: string;
  };
  links: string[];
  status: string;
  groupIds: string[];
  isSubscribed: boolean;
  isShowNotification: boolean;
  customFieldsData: any;
  isOwner: boolean;
  permissionActions: any;
  configs: any;
  configsConstants: any;
  branchIds: string[];
  score: number;
  leaderBoardPosition: number;
  employeeId: string;
  cursor: string;
}

export interface IBranchRemoveVariables {
  id: string;
}

export interface IBranchRemoveResponse {
  bmsBranchRemove: boolean;
}
