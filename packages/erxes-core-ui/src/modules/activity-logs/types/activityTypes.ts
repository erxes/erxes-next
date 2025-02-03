export interface IActivityLog {
  _id: string;
  action: string;
  contentId: string;
  contentType: string;
  content: {
    tagIds?: string[];
  };
  contentDetail: any;
  contentTypeDetail: any;
  createdAt: string;
  createdBy: string;
  createdByDetail: {
    type: string;
    content: {
      details: {
        fullName: string;
      };
    };
  };
}
