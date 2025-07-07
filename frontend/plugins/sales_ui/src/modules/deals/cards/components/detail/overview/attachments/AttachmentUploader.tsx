import { Spinner, Upload, cn } from 'erxes-ui';

import { IconPaperclip } from '@tabler/icons-react';
import { useAttachmentContext } from './AttachmentContext';
import { useState } from 'react';

const AttachmentUploader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { addAttachment } = useAttachmentContext();

  return (
    <Upload.Root
      value={''}
      multiple={true}
      className={cn('items-center', {
        'opacity-50': isLoading,
      })}
      onChange={(fileInfo) => {
        if ('url' in fileInfo) {
          addAttachment(fileInfo as any);
        }
      }}
    >
      <Upload.Preview
        className="hidden"
        onUploadStart={() => setIsLoading(true)}
        onUploadEnd={() => setIsLoading(false)}
      />
      <Upload.Button
        size="sm"
        variant="ghost"
        type="button"
        className={cn('flex items-center gap-1 cursor-pointer text-sm', {
          'opacity-50': isLoading,
        })}
      >
        {isLoading ? <Spinner /> : <IconPaperclip size={16} />}
        Add attachments
      </Upload.Button>
    </Upload.Root>
  );
};

export default AttachmentUploader;
