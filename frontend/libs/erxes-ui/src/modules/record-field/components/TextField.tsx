import { ButtonProps, Input, TextOverflowTooltip } from 'erxes-ui/components';
import { InlineCell } from 'erxes-ui/modules/inline-cell/components/InlineCell';
import { InlineCellDisplay } from 'erxes-ui/modules/inline-cell/components/InlineCellDisplay';
import { InlineCellEdit } from 'erxes-ui/modules/inline-cell/components/InlineCellEdit';
import React, { useEffect, useState } from 'react';

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
    field: string;
    fieldId?: string;
    onSave?: (value: string) => void;
    _id: string;
  }
>(
  (
    { className, placeholder, value, field, fieldId, _id, onSave, ...props },
    ref,
  ) => {
    const [editingValue, setEditingValue] = useState(value);

    useEffect(() => {
      if (value) setEditingValue(value);
    }, [value]);

    const handleAction = (closeEditMode: () => void) => {
      closeEditMode();
      if (editingValue === value) return;
      onSave && onSave(editingValue);
    };

    return (
      <InlineCell
        name={field}
        recordId={_id}
        fieldId={fieldId}
        onEnter={handleAction}
        onEscape={handleAction}
        onCancel={handleAction}
        display={() => (
          <InlineCellDisplay ref={ref} {...props} className={className}>
            <TextOverflowTooltip value={editingValue ?? placeholder} />
          </InlineCellDisplay>
        )}
        edit={() => (
          <InlineCellEdit>
            <Input
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
            />
          </InlineCellEdit>
        )}
      />
    );
  },
);
