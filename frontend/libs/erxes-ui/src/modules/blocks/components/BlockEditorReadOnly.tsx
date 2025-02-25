import { useCreateBlockNote } from '@blocknote/react';
import { BLOCK_SCHEMA } from 'erxes-ui/modules/blocks/constant/blockEditorSchema';
import { Block } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/shadcn';
import 'erxes-ui/modules/blocks/styles/styles.css';
import { useAtomValue } from 'jotai';
import { themeState } from 'erxes-ui/state';

export const BlockEditorReadOnly = ({ content }: { content: Block[] }) => {
  const editor = useCreateBlockNote({
    schema: BLOCK_SCHEMA,
    initialContent: content,
  });
  const theme = useAtomValue(themeState);

  return (
    <BlockNoteView
      className="read-only"
      editor={editor}
      editable={false}
      formattingToolbar={false}
      slashMenu={false}
      sideMenu={false}
      theme={theme as 'light' | 'dark'}
    />
  );
};
