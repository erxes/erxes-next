import { BlockNoteView } from '@blocknote/shadcn';
import '@blocknote/shadcn/style.css';
import {
  createReactInlineContentSpec,
  SuggestionMenuController,
} from '@blocknote/react';

import 'erxes-ui/modules/blocks/styles/styles.css';
import { useTheme } from 'erxes-ui/modules/theme-provider';
import { BLOCK_SCHEMA } from 'erxes-ui/modules/blocks/constant/blockEditorSchema';
import { SlashMenu } from './SlashMenu';
import { Toolbar } from './Toolbar';
import { Button, Tooltip } from 'erxes-ui/components';

interface BlockEditorProps {
  editor: IBlockEditor;
  onFocus?: () => void;
  onBlur?: () => void;
  onPaste?: (event: ClipboardEvent) => void;
  onChange?: () => void;
  readonly?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export type IBlockEditor = typeof BLOCK_SCHEMA.BlockNoteEditor;

export const BlockEditor = ({
  editor,
  onFocus,
  onBlur,
  onPaste,
  onChange,
  readonly,
  children,
  className,
}: BlockEditorProps) => {
  const { theme } = useTheme();

  return (
    <BlockNoteView
      theme={theme as 'light' | 'dark'}
      editor={editor}
      slashMenu={false}
      onFocus={onFocus}
      onBlur={onBlur}
      editable={!readonly}
      onChange={onChange}
      className={className}
      formattingToolbar={false}
      shadCNComponents={{
        Button: { Button },
        Tooltip: {
          Tooltip,
          TooltipContent: Tooltip.Content,
          TooltipProvider: Tooltip.Provider,
          TooltipTrigger: Tooltip.Trigger,
        },
      }}
    >
      <SuggestionMenuController
        triggerCharacter="/"
        suggestionMenuComponent={SlashMenu}
      />
      <Toolbar />
      {children}
    </BlockNoteView>
  );
};

export const Mention = createReactInlineContentSpec(
  {
    type: 'mention',
    propSchema: {
      fullName: {
        default: 'Unknown',
      },
      _id: {
        default: '',
      },
    },
    content: 'none',
  },
  {
    render: (props) => (
      <span className="bg-primary/10 p-1 rounded font-bold text-sm text-primary inline-flex items-center">
        @{props.inlineContent.props.fullName}
      </span>
    ),
  },
);
