import { useUpload } from 'erxes-ui/hooks';
import { readFile } from 'erxes-ui/utils/core';
import { CircleUserRound, Trash2Icon, UploadIcon } from 'lucide-react';
import React, {
  createContext,
  MutableRefObject,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { cn } from '../lib/utils';
import { Button, ButtonProps } from './button';

type IUploadContext = {
  url: string | undefined;
  onChange: (value: string) => void;
  setPreviewUrl: (previewUrl: string | undefined) => void;
  previewRef: MutableRefObject<string | null>;
  fileInputRef: MutableRefObject<HTMLInputElement | null>;
  handleThumbnailClick: () => void;
};

const UploadContext = createContext<IUploadContext | null>(null);

type UploadPreviewProps = {
  value: string;
  onChange: (value: string) => void;
} & React.ComponentPropsWithoutRef<'div'>;

const UploadRoot = React.forwardRef<HTMLDivElement, UploadPreviewProps>(
  ({ className, ...props }, ref) => {
    const { value, onChange } = props;

    const previewRef = useRef<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [previewUrl, setPreviewUrl] = useState<string | undefined>();

    const url = previewUrl || value;

    const handleThumbnailClick = useCallback(() => {
      fileInputRef.current?.click();
    }, []);

    return (
      <UploadContext.Provider
        value={{
          url,
          onChange,
          fileInputRef,
          previewRef,
          setPreviewUrl,
          handleThumbnailClick,
        }}
      >
        <div ref={ref} className={cn('flex gap-4', className)} {...props} />
      </UploadContext.Provider>
    );
  }
);

UploadRoot.displayName = 'UploadRoot';

const UploadPreview = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
  const { isLoading, upload } = useUpload();

  const uploadContext = useContext(UploadContext);

  if (!uploadContext) {
    throw new Error('UploadContext must be used within an UploadRoot');
  }

  const {
    url,
    onChange,
    setPreviewUrl,
    fileInputRef,
    previewRef,
    handleThumbnailClick,
  } = uploadContext;

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files;

      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }

      upload({
        files: file,

        afterUpload: ({ response }) => {
          onChange && onChange(response);
        },

        afterRead: ({ result }) => {
          setPreviewUrl(result);
        },
      });
    },
    [previewRef]
  );

  return (
    <>
      <div className="relative inline-flex">
        <Button
          type="button"
          variant="outline"
          className="relative size-16 overflow-hidden"
          onClick={handleThumbnailClick}
          aria-label={url ? 'Change image' : 'Upload image'}
        >
          {isLoading ? (
            <div
              className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-gray-600 rounded-full dark:text-gray-500"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </div>
          ) : url ? (
            <img
              className="h-full w-full object-cover absolute"
              src={readFile(url)}
              alt="Preview of uploaded"
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRound
                className="opacity-60"
                size={16}
                strokeWidth={2}
              />
            </div>
          )}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          aria-label="Upload image file"
        />
      </div>
      <div className="sr-only" aria-live="polite" role="status">
        {url ? 'Image uploaded and preview available' : 'No image uploaded'}
      </div>
    </>
  );
});

UploadPreview.displayName = 'UploadPreview';

const UploadButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    const uploadContext = useContext(UploadContext);

    if (!uploadContext) {
      throw new Error('UploadContext must be used within an UploadRoot');
    }

    const { handleThumbnailClick } = uploadContext;

    return (
      <Button
        ref={ref}
        className={cn('flex', className)}
        {...props}
        onClick={handleThumbnailClick}
      >
        <UploadIcon />
        Upload
      </Button>
    );
  }
);

UploadButton.displayName = 'UploadButton';

const RemoveButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    const { isLoading, remove } = useUpload();

    const uploadContext = useContext(UploadContext);

    if (!uploadContext) {
      throw new Error('UploadContext must be used within an UploadRoot');
    }

    const { url, previewRef, onChange, setPreviewUrl } = uploadContext;

    if (!url) {
      return <div />;
    }

    const handleRemove = () => {
      const urlArray = url.split('/');

      const fileName =
        urlArray.length === 1 ? url : urlArray[urlArray.length - 1];

      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
        previewRef.current = null;
      }

      remove({
        fileName,

        afterRemove: ({ status }) => {
          if (status === 'ok') {
            setPreviewUrl(undefined);
            onChange('');
          }
        },
      });
    };

    return (
      <Button
        ref={ref}
        className={cn('flex', className)}
        {...props}
        onClick={handleRemove}
      >
        <Trash2Icon />
        Remove
      </Button>
    );
  }
);

RemoveButton.displayName = 'RemoveButton';

export const Upload = {
  Root: UploadRoot,
  Preview: UploadPreview,
  Button: UploadButton,
  RemoveButton: RemoveButton,
};
