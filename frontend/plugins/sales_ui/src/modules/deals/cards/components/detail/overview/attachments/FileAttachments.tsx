import {
  IconChevronLeft,
  IconChevronRight,
  IconTrash,
} from '@tabler/icons-react';

import { Button } from 'erxes-ui';
import { IAttachment } from '@/deals/types/attachments';
import { useAttachmentContext } from './AttachmentContext';
import { useDealsContext } from '@/deals/context/DealContext';

const FileAttachments = ({ attachments }: { attachments: IAttachment[] }) => {
  const { handleRemoveImage, removingUrl } = useAttachmentContext();
  const { loading } = useDealsContext();

  return (
    <div className="p-4">
      <h4 className="uppercase text-sm text-gray-500 pb-4">File Attachments</h4>
      <div className="relative">
        <div className="overflow-x-auto flex gap-4">
          {attachments.map((attachment) => (
            <div
              className="p-2 bg-indigo-100 text-indigo-600 rounded-md flex items-center gap-2 relative"
              key={attachment.url}
            >
              <a href={attachment.url}>{attachment.name}</a>
              <Button
                variant="ghost"
                disabled={loading && removingUrl === attachment.url}
                onClick={(e) => handleRemoveImage(e, attachment)}
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
      </div>
    </div>
  );
};

export default FileAttachments;
