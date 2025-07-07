export type IAttachment = {
  url: string;
  name: string;
  size: number;
  type: string;
  duration?: number;
};

export type AttachmentContextType = {
  attachments: IAttachment[];
  addAttachment: (attachment: IAttachment) => void;
  removeAttachment: (url: string) => void;
  resetAttachments: () => void;
};
