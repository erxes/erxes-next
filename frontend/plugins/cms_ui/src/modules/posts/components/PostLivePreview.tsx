import React from 'react';

type PostLivePreviewProps = {
  title: string;
  description: string;
};

export const PostLivePreview: React.FC<PostLivePreviewProps> = ({
  title,
  description,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto border p-4 rounded shadow bg-white">
      <h1 className="text-2xl font-bold mb-4">{title || 'Post title'}</h1>
      <div className="text-gray-700 leading-relaxed">
        {description ? (
          <div dangerouslySetInnerHTML={{ __html: `<p>${description}</p>` }} />
        ) : (
          <p>Post description will appear here.</p>
        )}
      </div>
    </div>
  );
};
