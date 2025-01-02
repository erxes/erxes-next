'use client';
import * as React from 'react';
import { Button, DropdownMenu } from 'erxes-ui/components';
import { IconCheck } from '@tabler/icons-react';
import {
  IconDeviceUnknown,
  IconHotelService,
  IconPackage,
  IconStar,
} from '@tabler/icons-react';
import { useUom } from '@/products/hooks/useUom';

const iconMap = {
  unique: IconDeviceUnknown,
  subscription: IconStar,
  service: IconHotelService,
  product: IconPackage,
};

interface UomFormProps {
  value: string;
  onChange: (value: string) => void;
}

export const UomForm: React.FC<UomFormProps> = ({ value, onChange }) => {
  const { uoms, loading } = useUom({});
  const currentValue =
    uoms?.find((uom) => uom.value === value)?.value || 'product';
  return (
    <div className="space-y-2">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button
            variant="secondary"
            size="sm"
            asChild
            className="truncate justify-start h-8"
          >
            <div className="mx-2 ">
              <div className="py-2 flex gap-2">
                {React.createElement(iconMap[currentValue], {
                  className: 'h-4 w-4',
                })}
                <span>
                  {uoms.find((uom) => uom.value === currentValue)?.label}
                </span>
              </div>
            </div>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            side="bottom"
            sideOffset={8}
            onClick={(e) => e.stopPropagation()}
            className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]"
          >
            {uoms.map((uom) => (
              <DropdownMenu.Item
                className="h-7 text-xs"
                key={uom._id}
                onSelect={() => {
                  onChange(uom._id);
                }}
              >
                <div className="py-2 flex gap-2">
                  <span>{uom.name}</span>
                </div>
                {currentValue === uom._id && (
                  <IconCheck className="ml-auto h-4 w-4" />
                )}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};
