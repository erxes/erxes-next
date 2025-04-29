 export interface IKind {
  kind: string;
}

 export interface IDetailParams {
  erxesApiId: string;
}

export interface IConversationId {
  conversationId: string;
}

export interface IPageParams {
  skip?: number;
  limit?: number;
}

export interface ICommentsParams extends IConversationId, IPageParams {
  isResolved?: boolean;
  commentId?: string;
  senderId: string;
}

export interface IMessagesParams extends IConversationId, IPageParams {
  getFirst?: boolean;
}
