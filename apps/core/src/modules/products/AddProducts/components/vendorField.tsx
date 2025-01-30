import { useState } from 'react';

import { IconCheck, IconChevronDown } from '@tabler/icons-react';

import { Button, Command, Popover, Skeleton } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib/utils';

import { useCompaniesLowDetail } from '@/products/hooks/useCompaniesLowDetail';

interface VendorFieldProps {
  value: string | undefined;
  onChange: (value: string) => void;
  className?: string;
}

export const VendorField = ({ value, onChange, className }: VendorFieldProps) => {
  const { companies, loading } = useCompaniesLowDetail();
  const [open, setOpen] = useState<boolean>(false);
  const currentValue = companies?.find((vendor) => vendor._id === value)?._id;

  const handleSelectVendor = (vendorId: string) => {
    onChange(vendorId === currentValue ? '' : vendorId);
    setOpen(false);
  };

  if (loading)
    return (
      <Skeleton className="truncate justify-start h-8 mr-1">
        <div className="mx-2 w-full">
          <div className="py-2 flex gap-2">
            <div className="h-4 w-24" />
          </div>
        </div>
      </Skeleton>
    );

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen} modal>
        <Popover.Trigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-controls="vendor-command-menu"
            className="truncate h-8 hover:cursor-pointer rounded-md shadow-none w-full justify-between"
          >
            <span
              className={cn(
                'truncate',
                !currentValue && 'text-foreground font-medium text-sm'
              )}
            >
              {currentValue
                ? companies.find((vendor) => vendor._id === currentValue)?.primaryName
                : 'Select vendor'}
            </span>
            <IconChevronDown
              size={16}
              strokeWidth={2}
              className="shrink-0 text-foreground"
              aria-hidden="true"
            />
          </Button>
        </Popover.Trigger>
        <Popover.Content
          className="w-56 min-w-[var(--radix-popper-anchor-width)] border-input p-0"
          align="start"
          sideOffset={4}
        >
          <Command id="vendor-command-menu">
            <Command.Input 
              placeholder="Search vendor..." 
              className="h-9"
            />
            <Command.List>
              <Command.Empty>No vendor found.</Command.Empty>
              <Command.Group>
                {companies.map((vendor) => (
                  <Command.Item
                    key={vendor._id}
                    className="h-7 text-xs text-foreground"
                    value={vendor._id}
                    onSelect={handleSelectVendor}
                  >
                    {vendor.primaryName}
                    {currentValue === vendor._id && (
                      <IconCheck size={16} strokeWidth={2} className="ml-auto" />
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