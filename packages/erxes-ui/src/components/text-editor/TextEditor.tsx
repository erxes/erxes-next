'use client';
import { BlockNoteView } from '@blocknote/mantine';
import {
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from '@blocknote/react';
import { CustomSideMenu } from 'erxes-ui/components/text-editor/components/CustomSideMenu';
import 'erxes-ui/components/text-editor/styles.css';
import '@blocknote/mantine/style.css';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/react/style.css';
import { cn } from 'erxes-ui/lib';
import { useState } from 'react';
import { BlockNoteEditor, filterSuggestionItems } from '@blocknote/core';

interface TextEditorProps {
  className?: string;
  parseTo?: 'html' | 'markdown';
  onChange?: (value: string) => void;
  value?: string;
}

const getCustomSlashMenuItems = (
  editor: BlockNoteEditor
): DefaultReactSuggestionItem[] => {
  const defaultItems = getDefaultReactSlashMenuItems(editor);
  return defaultItems.filter((item) => item.title !== 'Code Block');
};

export const TextEditor = ({
  className,
  parseTo = 'html',
  onChange,
  value,
}: TextEditorProps) => {
  const [blocks, setBlocks] = useState<any[]>([
    {
      id: "1",
      type: "paragraph",
      content: []
    }
  ]);

  const editor = useCreateBlockNote({
    initialContent: blocks
  });

  if (value && blocks.length === 1 && blocks[0].content.length === 0) {
    editor.tryParseHTMLToBlocks(value).then((convertedBlocks) => {
      setBlocks(convertedBlocks);
      editor.replaceBlocks(editor.document, convertedBlocks);
    });
  }

  const handleHtmlParse = async () => {
    const htmlContent = await editor.blocksToHTMLLossy(editor.document);
    return htmlContent;
  };

  const handleMarkdownParse = async () => {
    const markdownContent = await editor.blocksToMarkdownLossy(editor.document);
    return markdownContent;
  };

  const handleChange = async () => {
    if (!onChange) return;
    
    if (parseTo === 'html') {
      const html = await handleHtmlParse();
      onChange(html);
    } else {
      const markdown = await handleMarkdownParse();
      onChange(markdown);
    }
  };

  return (
    <div className={cn('h-[200px] w-full overflow-y-auto', className)}>
      <BlockNoteView
        editor={editor}
        sideMenu={false}
        slashMenu={false}
        onChange={handleChange}
        data-theming-css-variables-demo
      >
        <CustomSideMenu editor={editor} />
        <SuggestionMenuController
          triggerCharacter={'/'}
          getItems={async (query) =>
            filterSuggestionItems(getCustomSlashMenuItems(editor), query)
          }
        />
      </BlockNoteView>
    </div>
  );
};
