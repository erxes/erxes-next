export const STATUSES = [
  { label: 'Active', value: 'Active' },
  { label: 'Deleted', value: 'Deleted' },
];

export const COMPANY_BUSINESS_TYPES = [
  '',
  'Analyst',
  'Competitor',
  'Customer',
  'Integrator',
  'Investor',
  'Partner',
  'Press',
  'Prospect',
  'Reseller',
  'Other',
];

export const DEFAULT_COMPANY_INDUSTRY_TYPES = [
  '',
  'Aerospace & Defense',
  'Air Freight & Logistics',
  'Airlines',
  'Auto Components',
  'Automobiles',
  'Banks',
  'Beverages',
  'Biotechnology',
  'Building Products',
  'Capital Markets',
  'Chemicals',
  'Commercial Services & Supplies',
  'Communications Equipment',
  'Construction & Engineering',
  'Construction Materials',
  'Consumer Finance',
  'Containers & Packaging',
  'Distributors',
  'Diversified Consumer Services',
  'Diversified Financial Services',
  'Diversified Telecommunication Services',
  'Electric Utilities',
  'Electrical Equipment',
  'Electronic Equipment, Instruments & Components',
  'Energy Equipment & Services',
  'Entertainment',
  'Equity Real Estate Investment Trusts (REITs)',
  'Food & Staples Retailing',
  'Food Products',
  'Gas Utilities',
  'Health Care Equipment & Supplies',
  'Health Care Providers & Services',
  'Health Care Technology',
  'Hotels, Restaurants & Leisure',
  'Household Durables',
  'Household Products',
  'Independent Power and Renewable Electricity Producers',
  'Industrial Conglomerates',
  'Insurance',
  'Interactive Media & Services',
  'Internet & Direct Marketing Retail',
  'IT Services',
  'Leisure Products',
  'Life Sciences Tools & Services',
  'Machinery',
  'Marine',
  'Media',
  'Metals & Mining',
  'Mortgage Real Estate Investment Trusts (REITs)',
  'Multi-Utilities',
  'Multiline Retail',
  'Oil, Gas & Consumable Fuels',
  'Paper & Forest Products',
  'Personal Products',
  'Pharmaceuticals',
  'Professional Services',
  'Real Estate Management & Development',
  'Road & Rail',
  'Semiconductors & Semiconductor Equipment',
  'Software',
  'Specialty Retail',
  'Technology Hardware, Storage & Peripherals',
  'Textiles, Apparel & luxury goods',
  'Thrifts & Mortgage Finance',
  'Tobacco',
  'Trading Companies & Distributors',
  'Transportation Infrastructure',
  'Water Utilities',
  'Wireless Telecommunication Services',
  'Transportation',
  'Mining',
  'Finance',
  'Group company',
  'Government',
  'Utility',
  'Education',
  'Manufacturing',
  'Communication',
  'Retail',
  'Health',
  'Construction',
  'Management',
];

export const COMPANY_INDUSTRY_TYPES = [...DEFAULT_COMPANY_INDUSTRY_TYPES];

export const DEFAULT_SOCIAL_LINKS = [
  { label: 'Facebook', value: 'facebook' },
  { label: 'whatsapp', value: 'whatsapp' },
  { label: 'Twitter', value: 'twitter' },
  { label: 'Youtube', value: 'youtube' },
  { label: 'Website', value: 'website' },
];

export const SOCIAL_LINKS = [
  ...DEFAULT_SOCIAL_LINKS,
  { label: 'Academia.edu', value: 'academia.edu' },
  { label: 'Chess.com', value: 'chess.com' },
  { label: 'Crunchyroll', value: 'crunchyroll' },
  { label: 'DeviantArt', value: 'deviantArt' },
  { label: 'Discord', value: 'discord' },
  { label: 'Douban', value: 'douban' },
  { label: 'eToro', value: 'eToro' },
  { label: 'Flickr', value: 'flickr' },
  { label: 'Gapo', value: 'gapo' },
  { label: 'Goodreads', value: 'goodreads' },
  { label: 'GitHub', value: 'gitHub' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'KakaoStory', value: 'kakaoStory' },
  { label: 'KizlarSoruyor', value: 'kizlarSoruyor' },
  { label: 'Last.fm', value: 'last.fm' },
  { label: 'LinkedIn', value: 'linkedIn' },
  { label: 'LiveJournal', value: 'liveJournal' },
  { label: 'Pinterest', value: 'pinterest' },
  { label: 'Pixnet', value: 'pixnet' },
  { label: 'Plurk', value: 'plurk' },
  { label: 'Quora', value: 'quora' },
  { label: 'Reddit', value: 'reddit' },
  { label: 'Renren', value: 'renren' },
  { label: 'Sina Weibo', value: 'sinaWeibo' },
  { label: 'SoundCloud', value: 'soundCloud' },
  { label: 'Spotify', value: 'spotify' },
  { label: 'Steam', value: 'steam' },
  { label: 'Tagged', value: 'tagged' },
  { label: 'Taringa', value: 'taringa' },
  { label: 'Tumblr', value: 'tumblr' },
  { label: 'VK', value: 'vk' },
  { label: 'Voat', value: 'voat' },
  { label: 'Wattpad', value: 'wattpad' },
  { label: 'XING', value: 'xing' },
  { label: 'Yammer', value: 'yammer' },
  { label: 'Yelp', value: 'yelp' },
];

export const DEFAULT_SEX_CHOICES = [
  { label: 'Not known', value: 0 },
  { label: 'Male', value: 1 },
  { label: 'Female', value: 2 },
  { label: 'Not applicable', value: 9 },
];

export const SEX_OPTIONS = [
  ...DEFAULT_SEX_CHOICES,
  { label: 'co/co', value: 10 },
  { label: 'en/en', value: 11 },
  { label: 'ey/em', value: 12 },
  { label: 'he/him', value: 13 },
  { label: 'he/them', value: 14 },
  { label: 'she/her', value: 15 },
  { label: 'she/them', value: 16 },
  { label: 'they/them', value: 17 },
  { label: 'xie/hir', value: 18 },
  { label: 'yo/yo', value: 19 },
  { label: 'ze/zir', value: 20 },
  { label: 've/vis', value: 21 },
  { label: 'xe/xem', value: 22 },
];

export const DEFAULT_CONSTANT_VALUES = {
  sex_choices: DEFAULT_SEX_CHOICES,
  company_industry_types: DEFAULT_COMPANY_INDUSTRY_TYPES.map((v) => ({
    label: v,
    value: v,
  })),
  social_links: DEFAULT_SOCIAL_LINKS,
};

export const USER_ROLES = {
  SYSTEM: 'system',
  USER: 'user',
  ALL: ['system', 'user'],
};

export const USER_PROPERTIES_INFO = {
  email: 'Primary email',
  username: 'User name',
  ALL: [
    { field: 'email', label: 'Primary email', canHide: false },
    { field: 'username', label: 'User name' },
  ],
};

export const STRUCTURE_STATUSES = {
  ACTIVE: 'active',
  DELETED: 'deleted',
};

export const USER_MOVEMENT_STATUSES = {
  CREATED: 'created',
  REMOVED: 'removed',
};

export const CUSTOMER_SELECT_OPTIONS = {
  SEX: [
    ...DEFAULT_SEX_CHOICES,
    { label: 'co/co', value: 10 },
    { label: 'en/en', value: 11 },
    { label: 'ey/em', value: 12 },
    { label: 'he/him', value: 13 },
    { label: 'he/them', value: 14 },
    { label: 'she/her', value: 15 },
    { label: 'she/them', value: 16 },
    { label: 'they/them', value: 17 },
    { label: 'xie/hir', value: 18 },
    { label: 'yo/yo', value: 19 },
    { label: 'ze/zir', value: 20 },
    { label: 've/vis', value: 21 },
    { label: 'xe/xem', value: 22 },
  ],
  EMAIL_VALIDATION_STATUSES: [
    { label: 'Valid', value: 'valid' },
    { label: 'Invalid', value: 'invalid' },
    { label: 'Accept all unverifiable', value: 'accept_all_unverifiable' },
    { label: 'Unverifiable', value: 'unverifiable' },
    { label: 'Unknown', value: 'unknown' },
    { label: 'Disposable', value: 'disposable' },
    { label: 'Catch all', value: 'catchall' },
    { label: 'Bad syntax', value: 'badsyntax' },
  ],
  PHONE_VALIDATION_STATUSES: [
    { label: 'Valid', value: 'valid' },
    { label: 'Invalid', value: 'invalid' },
    { label: 'Unknown', value: 'unknown' },
    { label: 'Can receive sms', value: 'receives_sms' },
    { label: 'Unverifiable', value: 'unverifiable' },
  ],
  LEAD_STATUS_TYPES: [
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'attemptedToContact' },
    { label: 'Working', value: 'inProgress' },
    { label: 'Bad Timing', value: 'badTiming' },
    { label: 'Unqualified', value: 'unqualified' },
    { label: 'Unknown', value: '' },
  ],
  STATUSES,
  DO_NOT_DISTURB: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: 'Unknown', value: '' },
  ],
  HAS_AUTHORITY: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: 'Unknown', value: '' },
  ],
  STATE: [
    { label: 'Visitor', value: 'visitor' },
    { label: 'Lead', value: 'lead' },
    { label: 'Customer', value: 'customer' },
  ],
};
export const USER_EXTENDED_FIELDS = [
  {
    _id: Math.random(),
    name: 'departments',
    label: 'Departments',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'branches',
    label: 'Branches',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'password',
    label: 'password',
    type: 'string',
  },
];

export const USER_EXPORT_EXTENDED_FIELDS = [
  {
    _id: Math.random(),
    name: 'departments',
    label: 'Departments',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'branches',
    label: 'Branches',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'employeeId',
    label: 'Employee Id',
    type: 'string',
  },
];

export const INPUT_TYPE = [
  { label: 'Text', value: 'text' },
  { label: 'Text Area', value: 'textarea' },
];
