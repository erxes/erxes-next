import { useAtom } from 'jotai';
import { InlineCellIsInEditModeFamilyState } from 'erxes-ui/modules/inline-cell/states/InlineCellIsInEditModeFamilyState';
import React, { useEffect } from 'react';
import { InlineCellContext } from '../context/InlineCellContext';
import { InlineCellContainer } from './InlineCellContainer';
import { usePreviousHotkeyScope } from 'erxes-ui/modules/hotkey/hooks/usePreviousHotkeyScope';
import { useScopedHotkeys } from 'erxes-ui/modules/hotkey/hooks/useScopedHotkeys';

export const InlineCell = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    name: string;
    recordId: string;
    fieldId?: string;
    onEnter?: (closeEditMode: () => void) => void;
    onEscape?: (closeEditMode: () => void) => void;
    onCancel?: (closeEditMode: () => void) => void;
    display: () => React.ReactNode;
    edit?: (closeEditMode: () => void) => React.ReactNode;
    readOnly?: boolean;
  }
>(
  (
    {
      name,
      recordId,
      fieldId,
      children,
      edit,
      display,
      readOnly,
      onEnter,
      onEscape,
      onCancel,
      ...props
    },
    ref,
  ) => {
    const id = recordId + name + (fieldId || '');
    const [isInEditMode, setIsInEditMode] = useAtom(
      InlineCellIsInEditModeFamilyState(id),
    );
    const {
      setHotkeyScopeAndMemorizePreviousScope,
      goBackToPreviousHotkeyScope,
    } = usePreviousHotkeyScope();

    const closeEditMode = () => {
      setIsInEditMode(false);
      goBackToPreviousHotkeyScope();
    };

    const handleOpenEditMode = () => {
      setIsInEditMode(true);
      setHotkeyScopeAndMemorizePreviousScope(id);
    };

    const handleEscape = () => {
      if (onEscape) {
        onEscape(closeEditMode);
      } else {
        closeEditMode();
      }
    };

    const handleCancel = () => {
      if (onCancel) {
        onCancel(closeEditMode);
      } else {
        closeEditMode();
      }
    };

    const handleEnter = () => {
      if (onEnter) {
        onEnter(closeEditMode);
      } else {
        closeEditMode();
      }
    };

    useScopedHotkeys('Enter', handleEnter, id);

    useEffect(() => {
      return () => InlineCellIsInEditModeFamilyState.remove(id);
    }, [id]);

    return (
      <InlineCellContext.Provider
        value={{
          name,
          recordId,
          id,
          handleEscape,
          handleEnter,
          handleCancel,
          handleOpenEditMode,
        }}
      >
        <InlineCellContainer {...props} ref={ref}>
          {display?.()}
          {isInEditMode && edit?.(closeEditMode)}
        </InlineCellContainer>
      </InlineCellContext.Provider>
    );
  },
);

InlineCell.displayName = 'InlineCell';
