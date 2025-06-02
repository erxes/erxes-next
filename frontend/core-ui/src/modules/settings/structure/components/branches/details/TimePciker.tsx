import React, { useState } from 'react';
import IMask from 'imask';
import { IMaskInput } from 'react-imask';
import { parse, isValid, format } from 'date-fns';
import { cn } from 'erxes-ui';

interface TimeInputProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const TimePicker: React.FC<TimeInputProps> = ({
  value = '',
  onChange,
  className,
}) => {
  const [error, setError] = useState<string | null>(null);

  const validateTime = (val: string) => {
    const parsed = parse(val, 'hh:mm a', new Date());
    if (isValid(parsed)) {
      setError(null);
      onChange?.(format(parsed, 'hh:mm a'));
    } else {
      setError('Invalid time');
    }
  };

  return (
    <IMaskInput
      mask="00:00 aa"
      blocks={{
        aa: {
          mask: IMask.MaskedEnum,
          enum: ['AM', 'PM'],
        },
      }}
      lazy={false}
      unmask={true}
      value={value}
      onAccept={(val: any) => validateTime(val)}
      placeholder="HH:mm"
      className={cn(
        error ? 'border-destructive' : '',
        'border rounded px-2 py-1 focus:outline-none min-w-[86px]',
        className,
      )}
    />
  );
};
