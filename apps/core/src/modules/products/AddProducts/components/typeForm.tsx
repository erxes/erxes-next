'use client';
import { useState, FC } from 'react';
import { Select } from 'erxes-ui/components';
import {
  IconDeviceUnknown,
  IconHotelService,
  IconPackage,
  IconStar,
} from '@tabler/icons-react';

import { cn } from 'erxes-ui/lib/utils';

const types = [
  { label: 'Product', value: 'product', icon: IconPackage },
  { label: 'Service', value: 'service', icon: IconHotelService },
  { label: 'Unique', value: 'unique', icon: IconStar },
  { label: 'Subscription', value: 'subscription', icon: IconDeviceUnknown },
];

interface TypeFormProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const TypeForm: FC<TypeFormProps> = ({ value, onChange, className }) => {
  const [open, setOpen] = useState<boolean>(false);

  const currentType = types.find((type) => type.value === value);

  const handleSelectType = (typeValue: string) => {
    onChange(typeValue);
    setOpen(false);
  };

  return (
    <div className={className}>
      <Select
        open={open}
        onOpenChange={setOpen}
        onValueChange={handleSelectType}
        value={value}
      >
        <Select.Trigger className="truncate w-full justify-between text-foreground border-none h-9">
          <Select.Value
            placeholder={
              <span
                className={cn(
                  'truncate',
                  !currentType && 'text-foreground font-semibold text-xs'
                )}
              >
                {currentType?.label || 'Choose type'}
              </span>
            }
            className="text-foreground"
          />
        </Select.Trigger>
        <Select.Content
          className="w-56 min-w-[var(--radix-popper-anchor-width)] border-input p-0 [&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2"
          align="start"
        >
          {types.map((type) => (
            <Select.Item
              key={type.value}
              className="h-7 text-xs flex flex-start items-center gap-2"
              value={type.value}
            >
              <div className="flex gap-1">
                <type.icon
                  size={18}
                  strokeWidth={2}
                  className="shrink-0 text-foreground"
                  aria-hidden="true"
                />
                {type.label}
              </div>
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  );
};
