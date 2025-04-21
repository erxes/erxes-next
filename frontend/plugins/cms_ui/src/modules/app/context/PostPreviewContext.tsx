import React, { createContext, useContext, useState, ReactNode } from 'react';

type PostPreviewData = {
  title: string;
  description: string;
  type: string;
  categoryId: string;
  tag: string;
  status: string;
};

type PostPreviewContextType = {
  previewData: PostPreviewData;
  setPreviewData: (data: Partial<PostPreviewData>) => void;
};

const PostPreviewContext = createContext<PostPreviewContextType | undefined>(
  undefined,
);

export const PostPreviewProvider = ({ children }: { children: ReactNode }) => {
  const [previewData, setPreviewState] = useState<PostPreviewData>({
    title: '',
    description: '',
    type: '',
    categoryId: '',
    tag: '',
    status: '',
  });

  const setPreviewData = (data: Partial<PostPreviewData>) => {
    setPreviewState((prev) => ({ ...prev, ...data }));
  };

  return (
    <PostPreviewContext.Provider value={{ previewData, setPreviewData }}>
      {children}
    </PostPreviewContext.Provider>
  );
};

export const usePostPreview = () => {
  const context = useContext(PostPreviewContext);
  if (!context) {
    throw new Error('usePostPreview must be used within a PostPreviewProvider');
  }
  return context;
};
