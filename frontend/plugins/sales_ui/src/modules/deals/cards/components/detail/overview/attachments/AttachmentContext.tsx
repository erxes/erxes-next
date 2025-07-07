import { AttachmentContextType, IAttachment } from '@/deals/types/attachments';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AttachmentContext = createContext<AttachmentContextType | null>(null);

export const useAttachmentContext = () => {
  const context = useContext(AttachmentContext);
  if (!context) {
    throw new Error(
      'useAttachmentContext must be used within <AttachmentProvider>',
    );
  }
  return context;
};

export const AttachmentProvider = ({
  children,
  initialAttachments = [],
}: {
  children: React.ReactNode;
  initialAttachments?: IAttachment[];
}) => {
  const [attachments, setAttachments] =
    useState<IAttachment[]>(initialAttachments);

  useEffect(() => {
    setAttachments(initialAttachments);
  }, [initialAttachments]);

  const addAttachment = (attachment: IAttachment) => {
    setAttachments((prev) => [...prev, attachment]);
  };

  const removeAttachment = (url: string) => {
    setAttachments((prev) => prev.filter((att) => att.url !== url));
  };

  const resetAttachments = () => {
    setAttachments([]);
  };

  return (
    <AttachmentContext.Provider
      value={{ attachments, addAttachment, removeAttachment, resetAttachments }}
    >
      {children}
    </AttachmentContext.Provider>
  );
};
