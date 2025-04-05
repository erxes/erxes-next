import { useState } from 'react';
import { useDebounce } from 'use-debounce';

import {
  Combobox,
  Command,
  Popover,
  TextOverflowTooltip,
  cn,
} from 'erxes-ui';

import { useCompanies } from '~/modules/products/hooks/useCompanies';
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
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const {
    companies,
    loading,
    handleFetchMore,
    totalCount = 0,
  } = useCompanies({
    variables: {
      searchValue: debouncedSearch,
    },
  });
  const currentValue = companies?.find((vendor) => vendor._id === value)?._id;

  const handleSelectVendor = (vendorId: string) => {
    onChange(vendorId === currentValue ? '' : vendorId);
    setOpen(false);
  };

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
        <Command id="vendor-command-menu" shouldFilter={false}>
          <Command.Input
            value={search}
            onValueChange={setSearch}
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
                className="h-7 relative flex items-center justify-between"
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
            <Combobox.FetchMore
              fetchMore={handleFetchMore}
              totalCount={totalCount}
              currentLength={companies.length}
            />
          </Command.List>
        </Command>
      </Combobox.Content>
    </Popover>
  );
};
