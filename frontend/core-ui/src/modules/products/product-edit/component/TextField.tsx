import { ButtonProps, Input } from 'erxes-ui/components';
import { InlineCell } from 'erxes-ui/modules/inline-cell/components/InlineCell';
import { InlineCellDisplay } from 'erxes-ui/modules/inline-cell/components/InlineCellDisplay';
import { InlineCellEdit } from 'erxes-ui/modules/inline-cell/components/InlineCellEdit';
import React, { useEffect, useState } from 'react';
import { useProductsEdit } from '../hooks/useProductEdit';

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
  const { productsEdit } = useProductsEdit();

  useEffect(() => {
    if (value) setEditingValue(value);
  }, [value]);

  const handleAction = (closeEditMode: () => void) => {
    closeEditMode();
    if (editingValue === value) return;

    // Ensure numeric fields (like unitPrice) are stored as numbers
    const formattedValue = ["unitPrice", "someOtherNumericField"].includes(field)
      ? parseFloat(editingValue) || 0
      : editingValue;

    console.log(`Updating field ${field}:`, typeof formattedValue, formattedValue);

    productsEdit(
      {
        variables: { _id, [field]: formattedValue },
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
            onChange={(e) => 
              setEditingValue(["unitPrice", "someOtherNumericField"].includes(field) 
                ? e.target.value.replace(/[^0-9.]/g, '') // Allow only numbers and dots
                : e.target.value
              )
            }
          />
        </InlineCellEdit>
      )}
    />
  );
});
