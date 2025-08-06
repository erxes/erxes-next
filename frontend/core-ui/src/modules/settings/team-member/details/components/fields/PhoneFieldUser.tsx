import { useUserEdit } from '@/settings/team-member/hooks/useUserEdit';
import { IDetailsType } from '@/settings/team-member/types';
import {
  PhoneInput,
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTablePopover,
} from 'erxes-ui';
import { formatPhoneNumber } from 'erxes-ui/utils/format';
import { useRef, useState } from 'react';

interface PhoneFieldUserProps {
  _id: string;
  details: IDetailsType & { __typename?: string };
}

export const PhoneFieldUser = ({ _id, details }: PhoneFieldUserProps) => {
  const { __typename, operatorPhone, ...rest } = details || {};
  const { usersEdit } = useUserEdit();
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editingValue, setEditingValue] = useState(operatorPhone || '');
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const handleSave = (newPhone: string) => {
    if (!isPhoneValid) return;
    if (newPhone === operatorPhone) {
      setIsOpen(false);
      return;
    }

    usersEdit({
      variables: { _id, details: { ...rest, operatorPhone: newPhone } },
    });
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditingValue(operatorPhone || '');
      setIsOpen(false);
    }
  };

  return (
    <RecordTablePopover
      scope={`user-${_id}-primaryPhone`}
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          setEditingValue(operatorPhone || '');
          setTimeout(() => {
            phoneInputRef.current?.focus();
          });
        } else if (!open && editingValue !== operatorPhone) {
          handleSave(editingValue);
        }
      }}
    >
      <RecordTableCellTrigger className="shadow-xs rounded-sm text-sm">
        {formatPhoneNumber({ value: operatorPhone || '' })}
      </RecordTableCellTrigger>
      <RecordTableCellContent>
        <PhoneInput
          value={editingValue}
          ref={phoneInputRef}
          className="bg-transparent"
          onChange={(value) => setEditingValue(value)}
          onEnter={() => handleSave(editingValue)}
          onKeyDown={handleKeyDown}
          onValidationChange={(isValid) => setIsPhoneValid(isValid)}
        />
      </RecordTableCellContent>
    </RecordTablePopover>
  );
};
