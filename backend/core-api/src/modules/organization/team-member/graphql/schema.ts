const commonDetailFields = `
  avatar: String
  coverPhoto: String
  fullName: String
  shortName: String
  birthDate: Date
  position: String
  workStartedDate: Date
  location: String
  description: String
  operatorPhone: String
  firstName: String
  middleName: String
  lastName: String
  employeeId: String
`;

export const types = `
  input UserDetails {
    ${commonDetailFields}
  }

  input EmailSignature {
    brandId: String
    signature: String
  }

  input InvitationEntry {
    email: String
    password: String
    groupId: String
    channelIds: [String]
    unitId: String
    branchId: String
    departmentId: String
  }

  enum UserChatStatus{
    offline
    online
  }

  type UserDetailsType {
    ${commonDetailFields}
  }

  type CookieOrganization {
    subdomain: String
    name: String
  }
  
  type Organization {
    name: String
    icon: String
    subdomain: String
    promoCodes: [String]
    isPaid: Boolean
    expiryDate: Date
    plan: String
    purchased: Int
    isWhiteLabel: Boolean
    setupService: JSON
    onboardingDone: Boolean
    contactRemaining: Boolean
    experienceName: String
    experience: JSON
    bundleNames: [String]
  
    charge: JSON
    createdAt: Date
    category: String
  }


  type User @key(fields: "_id") @cacheControl(maxAge: 3) {
    _id: String!
    createdAt: Date
    username: String
    email: String
    isActive: Boolean
    details: UserDetailsType
    links: JSON
    status: String
    chatStatus: UserChatStatus
    emailSignatures: JSON
    getNotificationByEmail: Boolean

    currentOrganization: Organization
    organizations: [CookieOrganization]
    
    groupIds: [String]
    isSubscribed: String
    isShowNotification: Boolean
    customFieldsData: JSON

    isOwner: Boolean
    permissionActions: JSON
    configs: JSON
    configsConstants: [JSON]

    department: Department

    departmentIds: [String]
    departments: [Department]
    branchIds: [String]
    branches: [Branch]
    positionIds: [String]
    positions: [Position]
    score: Float
    leaderBoardPosition: Int
    employeeId: String
  }

  type UserMovement {
    _id: String
    createdAt: Date
    createdBy: String
    createdByDetail:JSON
    userId:String
    userDetail:JSON
    contentType:String
    contentTypeId:String
    contentTypeDetail:JSON
    status:String
  }
`;

export const mutations = `
   usersCreateOwner(email: String!, password: String!, firstName: String!, lastName: String, purpose: String, subscribeEmail: Boolean): String
`;
