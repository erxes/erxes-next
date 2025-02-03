'use client';
// import { useState } from 'react';
// import { BlockNoteEditor, filterSuggestionItems } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/shadcn';
import '@blocknote/shadcn/style.css';
import {
  // DefaultReactSuggestionItem,
  // getDefaultReactSlashMenuItems,
  // SuggestionMenuController,
  useCreateBlockNote,
} from '@blocknote/react';
// import { CustomSideMenu } from 'erxes-ui/modules/text-editor/components/CustomSideMenu';
// import { cn } from 'erxes-ui/lib';

import 'erxes-ui/modules/text-editor/styles/styles.css';
import { useTheme } from 'erxes-ui/modules/theme-provider';
import { Select } from 'erxes-ui/components/select';
import * as Button from 'erxes-ui/components/button';
import { DropdownMenu } from 'erxes-ui/components/dropdown-menu';

interface TextEditorProps {
  className?: string;
  parseTo?: 'html' | 'markdown';
  onChange?: (value: string) => void;
  value?: string;
}

// const getCustomSlashMenuItems = (
//   editor: BlockNoteEditor,
// ): DefaultReactSuggestionItem[] => {
//   const defaultItems = getDefaultReactSlashMenuItems(editor);
//   return defaultItems.filter((item) => item.title !== 'Code Block');
// };

export const TextEditor = ({
  className,
  parseTo = 'html',
  onChange,
  value,
}: TextEditorProps) => {
  const editor = useCreateBlockNote();
  // const [blocks, setBlocks] = useState<any[]>([
  //   {
  //     id: '1',
  //     type: 'paragraph',
  //     content: [],
  //   },
  // ]);
  const { theme } = useTheme();
  // const editor = useCreateBlockNote({
  //   initialContent: blocks,
  // });
  // if (value && blocks.length === 1 && blocks[0].content.length === 0) {
  //   editor.tryParseHTMLToBlocks(value).then((convertedBlocks) => {
  //     setBlocks(convertedBlocks);
  //     editor.replaceBlocks(editor.document, convertedBlocks);
  //   });
  // }
  // const handleHtmlParse = async () => {
  //   const htmlContent = await editor.blocksToHTMLLossy(editor.document);
  //   return htmlContent;
  // };
  // const handleMarkdownParse = async () => {
  //   const markdownContent = await editor.blocksToMarkdownLossy(editor.document);
  //   return markdownContent;
  // };
  // const handleChange = async () => {
  //   if (!onChange) return;
  //   if (parseTo === 'html') {
  //     const html = await handleHtmlParse();
  //     onChange(html);
  //   } else {
  //     const markdown = await handleMarkdownParse();
  //     onChange(markdown);
  //   }
  // };

  return (
    <BlockNoteView
      theme={theme as 'light' | 'dark'}
      editor={editor}
      shadCNComponents={{
        Select: {
          Select: Select,
          SelectContent: Select.Content,
          SelectItem: Select.Item,
          SelectTrigger: Select.Trigger,
          SelectValue: Select.Value,
        },
        Button,
        DropdownMenu: {
          DropdownMenu: DropdownMenu,
          DropdownMenuCheckboxItem: DropdownMenu.CheckboxItem,
          DropdownMenuContent: DropdownMenu.Content,
          DropdownMenuItem: DropdownMenu.Item,
          DropdownMenuTrigger: DropdownMenu.Trigger,
          DropdownMenuLabel: DropdownMenu.Label,
          DropdownMenuSeparator: DropdownMenu.Separator,
          DropdownMenuSub: DropdownMenu.Sub,
          DropdownMenuSubContent: DropdownMenu.SubContent,
          DropdownMenuSubTrigger: DropdownMenu.SubTrigger,
        },
      }}
    />
  );
  // return (
  //   <div className={cn('h-[200px] w-full overflow-y-auto', className)}>
  //     <BlockNoteView
  //       editor={editor}
  //       sideMenu={false}
  //       slashMenu={false}
  //       onChange={handleChange}
  //       data-theming-css-variables-demo
  //       theme={theme as 'light' | 'dark'}
  //     >
  //       <CustomSideMenu editor={editor} />
  //       <SuggestionMenuController
  //         triggerCharacter={'/'}
  //         getItems={async (query) =>
  //           filterSuggestionItems(getCustomSlashMenuItems(editor), query)
  //         }
  //       />
  //     </BlockNoteView>
  //   </div>
  // );
};
