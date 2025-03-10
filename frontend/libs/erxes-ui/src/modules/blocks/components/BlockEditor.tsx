import { BlockNoteView } from '@blocknote/shadcn';
import '@blocknote/shadcn/style.css';
import {
  createReactInlineContentSpec,
  SuggestionMenuController,
} from '@blocknote/react';

import 'erxes-ui/modules/blocks/styles/styles.css';
import { themeState } from 'erxes-ui/state';
import { SlashMenu } from './SlashMenu';
import { Toolbar } from './Toolbar';
import { Button, Tooltip } from 'erxes-ui/components';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'erxes-ui/types/Key';
import { useAtomValue } from 'jotai';
import { BlockEditorProps } from '../types';
import { cn } from 'erxes-ui/lib';

export const BlockEditor = ({
  editor,
  onFocus,
  onBlur,
  onPaste,
  onChange,
  readonly,
  children,
  className,
  style,
  disabled,
  variant = 'default',
}: BlockEditorProps) => {
  const theme = useAtomValue(themeState);
  const [focus, setFocus] = useState(false);
  const hotkeyRef = useHotkeys(
    Key.Escape,
    () => {
      setFocus(false);
      onBlur?.();
    },
    { enabled: focus },
  );

  return (
    <BlockNoteView
      theme={theme as 'light' | 'dark'}
      editor={editor}
      slashMenu={false}
      onFocus={() => {
        setFocus(true);
        onFocus?.();
      }}
      onBlur={() => {
        setFocus(false);
        onBlur?.();
      }}
      editable={!readonly && !disabled}
      onChange={onChange}
      data-state={focus ? 'focus' : 'blur'}
      className={cn(
        variant === 'outline' && 'shadow-xs data-[state=focus]:shadow-focus',
        className,
      )}
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
      ref={hotkeyRef}
      style={style}
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
