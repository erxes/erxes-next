import { ButtonProps, Input, TextOverflowTooltip } from 'erxes-ui/components';
import {
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTablePopover,
} from 'erxes-ui/modules/record-table';
import React, { useState } from 'react';

export interface ITextFieldContainerProps {
  placeholder?: string;
  value: string | number;
  field: string;
  fieldId?: string;
  _id: string;
}

export const TextField = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    inputType?: 'number' | 'text';
    placeholder?: string;
    value: string | number;
    scope: string;
    onValueChange: (value: string | number) => void;
  }
>(({ placeholder, value, scope, onValueChange, children, inputType = 'text', ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingValue, setEditingValue] = useState(value);

  const handleAction = () => {
    if (editingValue === value) return;
    onValueChange && onValueChange(editingValue);
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
            value={inputType === 'number' ? Number(editingValue) : editingValue.toString()}
            onChange={(e) => {
              if (inputType === 'number') {
                setEditingValue(e.target.valueAsNumber);
              } else {
                setEditingValue(e.target.value);
              }
              setIsOpen(true);
            }}
            type={inputType}
          />
          <button type="submit" className="sr-only">
            Save
          </button>
        </form>
      </RecordTableCellContent>
    </RecordTablePopover>
  );
});
