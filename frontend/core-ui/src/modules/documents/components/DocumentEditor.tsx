import AttributeInEditor from '@/documents/components/AttributeInEditor';
import { DocumentEditorSkeleton } from '@/documents/components/DocumentEditorSkeleton';
import { useDocument } from '@/documents/hooks/useDocument';
import { useDocumentAttributes } from '@/documents/hooks/useDocumentAttributes';
import { BlockEditor, cn, useBlockEditor } from 'erxes-ui';

import { ChangeEvent, KeyboardEvent, useEffect, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const DocumentContentEditor = ({ editor, document }: any) => {
  const { attributes, loading } = useDocumentAttributes();

  const { control } = useFormContext();

  useEffect(() => {
    if (!document?.content || !editor) return;

    const loadInitialContent = async () => {
      let blocks;

      try {
        blocks = JSON.parse(document.content);
      } catch (_error) {
        blocks = await editor.tryParseHTMLToBlocks(document.content);
      }

      editor.replaceBlocks(editor.document, blocks);
    };

    loadInitialContent();
  }, [document?.content, editor]);

  return (
    <Controller
      name="content"
      control={control}
      rules={{ required: 'Content is required' }}
      render={({ field }) => {
        editor.onChange((editor: any) => {
          field.onChange(JSON.stringify(editor.document));
        });

        return (
          <BlockEditor
            editor={editor}
            className={cn('flex-1 w-full overflow-y-auto')}
          >
            <AttributeInEditor
              editor={editor}
              attributes={attributes}
              loading={loading}
            />
          </BlockEditor>
        );
      }}
    />
  );
};

const DocumentTitleEditor = ({
  value,
  onChange,
  onEnterPress,
}: {
  value: string;
  onChange: (value: string) => void;
  onEnterPress: () => void;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;

    const handleEventListener = () => {
      if (!textarea) {
        return;
      }

      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    handleEventListener();

    document.addEventListener('input', handleEventListener);
    document.addEventListener('resize', handleEventListener);

    return () => {
      document.removeEventListener('input', handleEventListener);
      document.removeEventListener('resize', handleEventListener);
    };
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      return onEnterPress();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      rows={1}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="Untitled"
      className="flex-none px-9 py-4 w-full font-bold text-[2.25rem] leading-[2.5rem] bg-transparent border-none outline-none focus:outline-none focus:ring-0 resize-none overflow-hidden"
    />
  );
};

export const DocumentEditor = () => {
  const { document, loading } = useDocument();
  const editor = useBlockEditor({});

  const { control } = useFormContext();

  const handleEnterPress = () => {
    if (!editor) return;

    editor.focus();
  };

  if (loading) {
    return <DocumentEditorSkeleton />;
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">No document found</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="flex flex-col w-full mx-auto">
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Title is required' }}
          render={({ field }) => (
            <DocumentTitleEditor
              value={field.value}
              onChange={field.onChange}
              onEnterPress={handleEnterPress}
            />
          )}
        />
        <DocumentContentEditor editor={editor} document={document} />
      </div>
    </div>
  );
};
