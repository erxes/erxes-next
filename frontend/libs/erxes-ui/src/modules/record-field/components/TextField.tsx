import { ButtonProps, Input, TextOverflowTooltip } from 'erxes-ui/components';
import {
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTablePopover,
} from 'erxes-ui/modules/record-table';
import React, { useState } from 'react';

export interface ITextFieldContainerProps {
  placeholder?: string;
  value: string;
  field: string;
  fieldId?: string;
  _id: string;
}

export const TextField = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    placeholder?: string;
    value: string;
    scope: string;
    onValueChange?: (value: string) => void;
    onSave?: (value: string) => void;
  }
>(
  (
    { placeholder, value, scope, onSave, onValueChange, children, ...props },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingValue, setEditingValue] = useState(value);

    const handleAction = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (editingValue === value) {
        setIsOpen(false);
        return;
      }
      onSave && onSave(editingValue);
      setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAction();
      }
      if (e.key === 'Escape') {
        setEditingValue(value);
        setIsOpen(false);
      }
    };

    return (
      <RecordTablePopover
        scope={scope}
        open={isOpen}
        onOpenChange={(open: boolean) => {
          setIsOpen(open);
          if (open) {
            setEditingValue(value);
          } else if (!open && editingValue !== value) {
            handleAction();
          }
        }}
      >
        <RecordTableCellTrigger {...props} ref={ref}>
          {children}
          <TextOverflowTooltip value={editingValue ?? placeholder} />
        </RecordTableCellTrigger>
        <RecordTableCellContent asChild>
          <form onSubmit={handleAction}>
            <Input
              value={editingValue}
              onChange={(e) => {
                setEditingValue(e.target.value);
                onValueChange?.(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button type="submit" className="sr-only">
              Save
            </button>
          </form>
        </RecordTableCellContent>
      </RecordTablePopover>
    );
  },
);
