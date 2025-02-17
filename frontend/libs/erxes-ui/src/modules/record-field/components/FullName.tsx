import { InlineCell } from 'erxes-ui/modules/inline-cell/components/InlineCell';
import { InlineCellDisplay } from 'erxes-ui/modules/inline-cell/components/InlineCellDisplay';
import { InlineCellEdit } from 'erxes-ui/modules/inline-cell/components/InlineCellEdit';
import { Button, Input } from 'erxes-ui/components';
import React, { useEffect, useState } from 'react';

export const FullName = React.forwardRef<
  React.ElementRef<typeof Button>,
  Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onChange'> & {
    recordId: string;
    firstName: string;
    lastName: string;
    fieldId?: string;
    onChange: (firstName: string, lastName: string) => void;
  }
>(({ recordId, firstName, lastName, fieldId, onChange, ...props }, ref) => {
  const [firstNameValue, setFirstNameValue] = useState(firstName);
  const [lastNameValue, setLastNameValue] = useState(lastName);

  const handleChange = (closeEditMode: () => void) => {
    closeEditMode();
    onChange(firstNameValue, lastNameValue);
  };

  useEffect(() => {
    if (firstName) setFirstNameValue(firstName);
    if (lastName) setLastNameValue(lastName);
  }, [firstName, lastName]);

  return (
    <InlineCell
      name="name"
      recordId={recordId}
      fieldId={fieldId}
      onEnter={handleChange}
      onEscape={handleChange}
      onCancel={handleChange}
      display={() => (
        <InlineCellDisplay ref={ref} {...props}>
          {firstNameValue} {lastNameValue}
        </InlineCellDisplay>
      )}
      edit={() => (
        <InlineCellEdit>
          <div className="flex -space-x-px">
            <Input
              placeholder="First Name"
              className="rounded-r-none focus-visible:z-10 max-w-36"
              value={firstNameValue}
              onChange={(e) => setFirstNameValue(e.target.value)}
            />
            <Input
              placeholder="Last Name"
              className="rounded-l-none focus-visible:z-10 max-w-36"
              value={lastNameValue}
              onChange={(e) => setLastNameValue(e.target.value)}
            />
          </div>
        </InlineCellEdit>
      )}
    />
  );
});
