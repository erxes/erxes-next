export interface Category {
  _id: string;
  title: string;
  code?: string;
  description?: string;
  icon?: string;
  numOfArticles?: number;
  authors?: Array<{
    _id: string;
    details: {
      fullName?: string;
      avatar?: string;
    };
  }>;
}

export interface TopicResponse {
  _id: string;
  title: string;
  code?: string;
  description?: string;
  categories?: Category[];
  color?: string;
  backgroundImage?: string;
  languageCode?: string;
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  notificationSegmentId?: string;
  parentCategories?: Category[];
}

export interface Topic {
  _id: string;
  title: string;
  code: string;
  description: string;
  brandId: string;
  color: string;
  backgroundImage: string;
  languageCode: string;
  notificationSegmentId: string;
  categories?: Category[];
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  parentCategories?: Category[];
}
