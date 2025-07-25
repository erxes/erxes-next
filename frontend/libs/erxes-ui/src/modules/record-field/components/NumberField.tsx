import { ButtonProps, Input, TextOverflowTooltip } from 'erxes-ui/components';
import {
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTablePopover,
} from 'erxes-ui/modules/record-table';
import React, { useState } from 'react';

export const NumberField = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    placeholder?: string;
    value: number;
    scope: string;
    onValueChange?: (value: number) => void;
    onSave?: (value: number) => void;
  }
>(
  (
    { placeholder, value, scope, onSave, onValueChange, children, ...props },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingValue, setEditingValue] = useState(value);

    const handleAction = () => {
      if (editingValue === value) return;
      onSave && onSave(editingValue);
    };

    return (
      <RecordTablePopover
        scope={scope}
        open={isOpen}
        onOpenChange={(open: boolean) => {
          setIsOpen(open);
          if (open) {
            setEditingValue(value);
          }
        }}
      >
        <RecordTableCellTrigger {...props} ref={ref}>
          {children}
          <TextOverflowTooltip value={editingValue.toString() ?? placeholder} />
        </RecordTableCellTrigger>
        <RecordTableCellContent asChild>
          <form onSubmit={handleAction}>
            <Input
              value={editingValue.toString()}
              onChange={(e) => {
                setEditingValue(Number(e.target.value));
                onValueChange && onValueChange(Number(e.target.value));
                setIsOpen(true);
              }}
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
