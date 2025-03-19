import { useState } from 'react';

import {
  Combobox,
  Command,
  Popover,
  Skeleton,
  TextOverflowTooltip,
  cn,
} from 'erxes-ui';

import { useCompaniesLowDetail } from '@/products/hooks/useCompaniesLowDetail';
interface VendorFieldProps {
  value: string | undefined;
  onChange: (value: string) => void;
  className?: string;
}

export const VendorField = ({
  value,
  onChange,
  className,
}: VendorFieldProps) => {
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
    <Popover open={open} onOpenChange={setOpen} modal>
      <Combobox.Trigger
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className={cn(
          'truncate h-8 hover:cursor-pointer rounded-md w-full justify-between',
          className,
        )}
      >
        <Combobox.Value
          placeholder="Select vendor"
          value={
            companies.find((vendor) => vendor._id === currentValue)?.primaryName
          }
        />
      </Combobox.Trigger>
      <Combobox.Content className="w-56">
        <Command id="vendor-command-menu">
          <Command.Input
            variant="secondary"
            wrapperClassName="flex-auto"
            placeholder="Search vendor..."
            className="h-9"
          />
          <Command.List>
            <Combobox.Empty loading={loading} />
            {companies.map((vendor) => (
              <Command.Item
                key={vendor._id}
                className=" h-7 relative flex items-center justify-between"
                value={vendor._id}
                onSelect={handleSelectVendor}
                title={vendor.primaryName}
              >
                <TextOverflowTooltip
                  className="ml-2"
                  value={vendor.primaryName}
                />
                <Combobox.Check checked={vendor._id === value} />
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </Combobox.Content>
    </Popover>
  );
};
