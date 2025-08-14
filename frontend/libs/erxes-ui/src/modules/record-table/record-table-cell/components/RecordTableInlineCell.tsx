import * as React from 'react';

import * as Popover from '@radix-ui/react-popover';
import { Cell } from '@tanstack/react-table';

import { cn } from 'erxes-ui/lib';

import {
  RecordTableCellContext,
  useRecordTableCellContext,
} from '../contexts/RecordTableCellContext';
import { usePreviousHotkeyScope } from 'erxes-ui/modules/hotkey/hooks/usePreviousHotkeyScope';
import { RecordTableScope } from 'erxes-ui/modules/record-table/types/RecordTableScope';

interface InlineCellProps extends React.HTMLAttributes<HTMLDivElement> {
  onSave?: (value: any) => void;
  getValue?: Cell<any, any>['getValue'];
  value?: unknown;
  display?: (props: InlineCellHandlers) => React.ReactNode;
  edit?: (props: InlineCellHandlers) => React.ReactNode;
  setValue?: (value: any) => void;
  containerClassName?: string;
}

interface InlineCellHandlers {
  isInEditMode: boolean;
  setIsInEditMode: (value: boolean) => void;
  handleSelect: (value: any) => void;
}

export function RecordTableInlineCell({
  onSave,
  getValue,
  value,
  display,
  edit,
  setValue,
  containerClassName,
  ...props
}: InlineCellProps) {
  const [isInEditMode, _setIsInEditMode] = React.useState(false);
  const {
    goBackToPreviousHotkeyScope,
    setHotkeyScopeAndMemorizePreviousScope,
  } = usePreviousHotkeyScope();

  const setIsInEditMode = (value: boolean) => {
    _setIsInEditMode(value);
    if (value) {
      setHotkeyScopeAndMemorizePreviousScope(RecordTableScope.InlineCellEdit);
    } else {
      goBackToPreviousHotkeyScope();
    }
  };

  const handleSave = () => {
    setIsInEditMode(false);
    if (value === getValue?.()) return;
    onSave?.(value);
  };

  const handleSelect = (selectedValue: any) => {
    setIsInEditMode(false);
    setValue?.(selectedValue);
    if (selectedValue === getValue?.()) return;
    onSave?.(selectedValue);
  };

  return (
    <RecordTableCellContext.Provider
      value={{
        isInEditMode,
        setIsInEditMode,
        handleSave,
        handleSelect,
      }}
    >
      <RecordTableInlineCellContainer {...props}>
        <RecordTableInlineCellContainer
          className={containerClassName || ''}
          readOnly={!edit}
        >
          {display?.({
            isInEditMode,
            setIsInEditMode,
            handleSelect,
          })}
        </RecordTableInlineCellContainer>
        <RecordTableInlineCellEditContainer>
          {edit?.({
            isInEditMode,
            setIsInEditMode,
            handleSelect,
          })}
        </RecordTableInlineCellEditContainer>
      </RecordTableInlineCellContainer>
    </RecordTableCellContext.Provider>
  );
}

export const RecordTableInlineCellContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { isInEditMode } = useRecordTableCellContext();

  return (
    <div
      ref={ref}
      className={cn(
        'w-full flex items-stretch relative h-8 cursor-pointer box-border overflow-hidden',
        isInEditMode && 'overflow-auto items-start',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

RecordTableInlineCellContainer.displayName = 'RecordTableInlineCellContainer';

export function RecordTableInlineCellContainer({
  className,
  readOnly,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { readOnly?: boolean }) {
  const { isInEditMode, setIsInEditMode } = useRecordTableCellContext();

  if (isInEditMode) return null;

  return (
    <div
      className={cn('w-full pl-2 flex items-center', className)}
      {...props}
      onClick={() => !readOnly && setIsInEditMode(true)}
    />
  );
}

export function RecordTableInlineCellEditContainer({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isInEditMode, handleSave } = useRecordTableCellContext();

  if (!isInEditMode) return null;

  return (
    <Popover.Root open={isInEditMode} onOpenChange={handleSave}>
      <Popover.Trigger className="w-full" />
      <Popover.Portal>
        <Popover.Content
          className={cn(
            'z-20 min-w-[--radix-popper-anchor-width] bg-background p-0 shadow-md',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          )}
          sideOffset={-1}
          align="start"
          {...props}
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

interface RecordTableInlineCellEditFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  onSubmit?: () => void;
}

export function RecordTableInlineCellEditForm({
  children,
  onSubmit,
  ...props
}: RecordTableInlineCellEditFormProps) {
  const { handleSave } = useRecordTableCellContext();

  return (
    <form
      onSubmit={(e) => {
        if (onSubmit) onSubmit();
        e.preventDefault();
        handleSave();
      }}
      {...props}
    >
      {children}
    </form>
  );
}
