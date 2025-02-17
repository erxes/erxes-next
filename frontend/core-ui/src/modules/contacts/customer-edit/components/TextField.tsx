import { ButtonProps, Input } from 'erxes-ui/components';
import { InlineCell } from 'erxes-ui/modules/inline-cell/components/InlineCell';
import { InlineCellDisplay } from 'erxes-ui/modules/inline-cell/components/InlineCellDisplay';
import { InlineCellEdit } from 'erxes-ui/modules/inline-cell/components/InlineCellEdit';
import React, { useEffect, useState } from 'react';
import { useCustomersEdit } from '../hooks/useCustomerEdit';

export const TextField = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    placeholder?: string;
    value: string;
    field: string;
    fieldId?: string;
    _id: string;
  }
>(({ className, placeholder, value, field, fieldId, _id, ...props }, ref) => {
  const [editingValue, setEditingValue] = useState(value);
  const { customersEdit } = useCustomersEdit();

  useEffect(() => {
    if (value) setEditingValue(value);
  }, [value]);

  const handleAction = (closeEditMode: () => void) => {
    closeEditMode();
    if (editingValue === value) return;
    customersEdit(
      {
        variables: { _id, [field]: editingValue },
      },
      [field],
    );
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
          {editingValue ?? placeholder}
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
});
