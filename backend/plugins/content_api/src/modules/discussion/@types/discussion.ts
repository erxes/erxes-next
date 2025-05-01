import { Document } from 'mongoose';

interface IDiscussion {
  createdAt: Date;
  createdUserId: string;

  title: string;
  content: string;
  attachments: any[];
  tags: string[];
  questions: string[];
}

export interface IDiscussionDocument extends IDiscussion, Document {
  _id: string;
}

export interface IVote {
  createdAt: Date;
  createdUserId: string;

  discussionId: string;
  isUp: boolean;
}

export interface IVoteDocument extends IVote, Document {
  _id: string;
}
