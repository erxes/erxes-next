import {
  PhoneInput,
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTablePopover,
} from 'erxes-ui';
import { formatPhoneNumber } from 'erxes-ui/utils/format';
import { useCustomersEdit } from '@/contacts/customers/customer-edit/hooks/useCustomerEdit';
import { useRef, useState } from 'react';

interface PhoneFieldCustomerProps {
  _id: string;
  primaryPhone: string;
}

export const PhoneFieldCustomer = ({
  _id,
  primaryPhone,
}: PhoneFieldCustomerProps) => {
  const { customersEdit } = useCustomersEdit();
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editingValue, setEditingValue] = useState(primaryPhone || '');

  const handleSave = (newPrimaryPhone: string) => {
    if (newPrimaryPhone === primaryPhone) {
      setIsOpen(false);
      return;
    }

    customersEdit(
      {
        variables: { _id, primaryPhone: newPrimaryPhone },
      },
      ['primaryPhone'],
    );
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditingValue(primaryPhone || '');
      setIsOpen(false);
    }
  };

  return (
    <RecordTablePopover
      scope={`customer-${_id}-primaryPhone`}
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          setEditingValue(primaryPhone || '');
          setTimeout(() => {
            phoneInputRef.current?.focus();
          });
        } else if (!open && editingValue !== primaryPhone) {
          handleSave(editingValue);
        }
      }}
    >
      <RecordTableCellTrigger className="shadow-sm rounded-sm text-sm">
        {formatPhoneNumber({ value: primaryPhone || '' })}
      </RecordTableCellTrigger>
      <RecordTableCellContent>
        <PhoneInput
          value={editingValue}
          ref={phoneInputRef}
          className="bg-transparent"
          onChange={(value) => setEditingValue(value)}
          onEnter={() => handleSave(editingValue)}
          // onKeyDown={handleKeyDown}
        />
      </RecordTableCellContent>
    </RecordTablePopover>
  );
};
