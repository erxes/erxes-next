import DOMPurify from 'dompurify';
import { useEffect, useRef, useState } from 'react';
import { Dialog } from 'erxes-ui';
import { InternalNoteDisplay } from 'ui-modules';
export const MessageContent = ({
  content,
  internalNote,
}: {
  content?: string;
  internalNote?: boolean;
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messageRef.current) return;

    const images = messageRef.current.getElementsByTagName('img');

    Array.from(images).forEach((img) => {
      img.style.cursor = 'pointer';
      img.onclick = () => setSelectedImage(img.src);
    });
  }, [content]);

  if (internalNote) {
    return <InternalNoteDisplay content={content || ''} />;
  }

  return (
    <>
      {!!content && (
        <div
          ref={messageRef}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(content || ''),
          }}
        />
      )}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <Dialog.Content className="max-w-[90vw] p-0 border-none overflow-hidden">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full size"
              className="w-full h-auto object-contain"
            />
          )}
        </Dialog.Content>
      </Dialog>
    </>
  );
};
