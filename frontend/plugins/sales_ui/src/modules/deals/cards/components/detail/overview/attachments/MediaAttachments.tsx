import { Button, Dialog, Spinner, readImage, useConfirm } from 'erxes-ui';
import {
  IconChevronLeft,
  IconChevronRight,
  IconTrash,
  IconX,
  IconZoomIn,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';

import { IAttachment } from '@/deals/types/attachments';
import { removeTypename } from '@/deals/utils/common';
import { useAttachmentContext } from './AttachmentContext';
import { useDealsContext } from '@/deals/context/DealContext';

const MediaAttachments = ({ attachments }: { attachments: IAttachment[] }) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [removingUrl, setRemovingUrl] = useState<string | null>(null);

  const { editDeals, loading } = useDealsContext();
  const { removeAttachment } = useAttachmentContext();
  const { confirm } = useConfirm();

  const handleRemoveImage = (e: React.MouseEvent, attachment: IAttachment) => {
    e.stopPropagation();
    // Call your mutation here
    confirm({
      message: `Are you sure you want to delete ${attachment.name}?`,
    }).then(() => {
      setRemovingUrl(attachment.url);

      editDeals({
        variables: {
          attachments: attachments
            .filter((att) => att.url !== attachment.url)
            .map((att) => removeTypename(att)),
        },
      })
        .then(() => {
          // Optionally update local state after successful mutation
          removeAttachment(attachment.url);
          setRemovingUrl(null);
        })
        .catch(() => {
          setRemovingUrl(null);
        });
    });
  };

  const currentAttachment = attachments[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % attachments.length);
      }
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) =>
          prev === 0 ? attachments.length - 1 : prev - 1,
        );
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, attachments.length]);

  return (
    <div className="p-4">
      <h4 className="uppercase text-sm text-gray-500 pb-4">
        Media Attachments
      </h4>
      <div className="relative">
        <div className="overflow-x-auto flex gap-4">
          {attachments.map((attachment, index) => (
            <div
              className="group relative w-36 h-36 rounded-lg border border-gray-200 shadow-md overflow-hidden shrink-0 cursor-zoom-in"
              key={attachment.url}
              onClick={() => {
                setCurrentIndex(index);
                setOpen(true);
              }}
            >
              <img
                className="w-full h-full object-cover"
                src={readImage(attachment.url)}
                alt={attachment.name}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                {loading && removingUrl === attachment.url ? (
                  <Spinner />
                ) : (
                  <IconZoomIn size={28} className="text-white" />
                )}
              </div>

              <Button
                variant="ghost"
                onClick={(e) => {
                  handleRemoveImage(e, attachment);
                }}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-md z-10"
                aria-label={`Remove image ${attachment.name}`}
              >
                <IconTrash size={16} />
              </Button>
            </div>
          ))}
        </div>
        <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 hidden lg:block">
          <button
            className="bg-white p-1 rounded-full shadow"
            onClick={() => {
              document.querySelector('.scrollable-media')?.scrollBy({
                left: -150,
                behavior: 'smooth',
              });
            }}
          >
            <IconChevronLeft size={20} />
          </button>
        </div>

        <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 hidden lg:block">
          <button
            className="bg-white p-1 rounded-full shadow"
            onClick={() => {
              document.querySelector('.scrollable-media')?.scrollBy({
                left: 150,
                behavior: 'smooth',
              });
            }}
          >
            <IconChevronRight size={20} />
          </button>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Content className="bg-transparent max-w-fit shadow-none border-0">
            <button
              className="absolute top-4 right-4 bg-white p-1 rounded-full z-50"
              onClick={() => setOpen(false)}
            >
              <IconX size={20} />
            </button>

            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full z-50"
              onClick={() =>
                setCurrentIndex(
                  currentIndex === 0
                    ? attachments.length - 1
                    : currentIndex - 1,
                )
              }
            >
              <IconChevronLeft size={24} />
            </button>

            <img
              src={readImage(currentAttachment.url)}
              alt={currentAttachment.name}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-lg"
            />

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full z-50"
              onClick={() =>
                setCurrentIndex((currentIndex + 1) % attachments.length)
              }
            >
              <IconChevronRight size={24} />
            </button>
          </Dialog.Content>
        </Dialog>
      </div>
    </div>
  );
};

export default MediaAttachments;
