import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

import { IAttachment } from '@/deals/types/attachments';

const FileAttachments = ({ attachments }: { attachments: IAttachment[] }) => {
  return (
    <div className="p-4">
      <h4 className="uppercase text-sm text-gray-500 pb-4">File Attachments</h4>
      <div className="relative">
        <div className="overflow-x-auto flex gap-4">
          {attachments.map((attachment) => (
            <div
              className="p-2 bg-indigo-100 text-indigo-600 rounded-md"
              key={attachment.url}
            >
              <a href={attachment.url}>{attachment.name}</a>
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
