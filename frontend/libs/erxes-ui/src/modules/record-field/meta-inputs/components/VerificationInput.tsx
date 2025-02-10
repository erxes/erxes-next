import { Select } from 'erxes-ui/components';
import { useId, useState } from 'react';
import { cn } from 'erxes-ui/lib';
import { VALIDATION_STATUS_INFOS } from 'erxes-ui/constants/ValidationStatusInfos';

interface VerificationInputProps {
  value: string | null;
  className?: string;
  onChange: (string) => void
}

export const VerificationInput = ({
  value,
  onChange,
  className,
}: VerificationInputProps) => {
  const id = useId();
  const [currentValue, setCurrentValue] = useState(value || VALIDATION_STATUS_INFOS[0].value);
  
  const currentStatus = VALIDATION_STATUS_INFOS.find(info => info.value === currentValue) || VALIDATION_STATUS_INFOS[0];

  const handleValueChange = (newValue: string) => {
    setCurrentValue(newValue);
    onChange(newValue)
  };

  return (
    <Select value={currentValue} onValueChange={handleValueChange} defaultValue={VALIDATION_STATUS_INFOS[0].value}>
      <Select.Trigger id={id} className={cn('flex gap-1 w-min', className)}>
        <StatusDot className={currentStatus.dotColor} />
      </Select.Trigger>
      <Select.Content>
        {VALIDATION_STATUS_INFOS.map((info) => (
          <Select.Item key={info.value} value={info.value}>
            <StatusIndicator dotColor={info.dotColor} label={info.label} />
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
};

interface StatusIndicatorProps {
  dotColor: string;
  label: string;
}

const StatusIndicator = ({ dotColor, label }: StatusIndicatorProps) => {
  return (
    <span className="flex items-center gap-2">
      <StatusDot className={dotColor} />
      <span className="truncate">{label}</span>
    </span>
  );
};

export const StatusDot = ({ className }: { className?: string }) => {
  return (
    <svg
      width="8"
      height="8"
      fill="currentColor"
      viewBox="0 0 8 8"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="4" cy="4" r="4" />
    </svg>
  );
};