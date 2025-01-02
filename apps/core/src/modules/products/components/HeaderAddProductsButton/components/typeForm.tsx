'use client';

import * as React from 'react';
import { Button, Popover, Command } from 'erxes-ui/components';
import { IconCheck } from '@tabler/icons-react';
import {
  IconDeviceUnknown,
  IconHotelService,
  IconPackage,
  IconStar,
} from '@tabler/icons-react';

import { cn } from 'erxes-ui/lib/utils';

const iconMap = {
  unique: IconDeviceUnknown,
  subscription: IconStar,
  service: IconHotelService,
  product: IconPackage,
};

const types = [
  { label: 'Product', value: 'product' },
  { label: 'Service', value: 'service' },
  { label: 'Unique', value: 'unique' },
  { label: 'Subscription', value: 'subscription' },
];

interface TypeFormProps {
  value: string;
  onChange: (value: string) => void;
}

export const TypeForm: React.FC<TypeFormProps> = ({ value, onChange }) => {
  const currentValue =
    types?.find((type) => type.value === value)?.value || 'product';
  return (
    <div className="space-y-2">
      <Popover>
        <Popover.Trigger asChild>
          <Button
            variant="secondary"
            size="sm"
            asChild
            className="truncate justify-start h-8"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="mx-2 ">
              <div className="py-2 flex gap-2">
                <span
                  className={cn('truncate', !currentValue && 'text-foreground')}
                >
                  {currentValue
                    ? types.find((type) => type.value === currentValue)?.label
                    : 'type not selected'}
                </span>
              </div>
            </div>
          </Button>
        </Popover.Trigger>
        <Popover.Content
          className="w-56 min-w-[var(--radix-popper-anchor-width)] border-input p-0"
          align="start"
        >
          <Command>
            <Command.List>
              <Command.Empty>No type found.</Command.Empty>
              <Command.Group>
                {types.map((type) => (
                  <Command.Item
                    key={type.value}
                    className="h-7 text-xs"
                    value={type.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                    }}
                  >
                    {type.label}
                    {currentValue === type.value && (
                      <IconCheck
                        size={16}
                        strokeWidth={2}
                        className="ml-auto"
                      />
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover>
    </div>
  );
};
