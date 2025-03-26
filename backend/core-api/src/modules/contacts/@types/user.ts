export interface IUserMovementDocument extends Document {
    _id: string;
    contentType: string;
    contentTypeId: string;
    userId: string;
    createdAt: string;
    createdBy: string;
    status: string;
    isActive: boolean;
  }