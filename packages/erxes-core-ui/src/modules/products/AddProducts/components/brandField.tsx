import { useState } from 'react';

import { IconCheck, IconChevronDown } from '@tabler/icons-react';

import { Button, Command, Popover, Skeleton } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib/utils';

import { useBrands } from '@/products/hooks/useBrands';

interface BrandFieldProps {
  values: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

export const BrandField = ({ values, onChange, className }: BrandFieldProps) => {
  const { brands, loading } = useBrands({});
  const [open, setOpen] = useState<boolean>(false);
  const currentValue = brands?.find((brand) => brand._id === values?.[0])?._id;

  const handleSelectBrand = (brandId: string) => {
    onChange(brandId === currentValue ? [] : [brandId]);
    setOpen(false);
  };

  if (loading)
    return (
      <Skeleton className="h-8 w-full">
        <div className="h-4 w-24" />
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
            aria-controls="brand-command-menu"
            className="truncate h-8 hover:cursor-pointer rounded-md shadow-none w-full justify-between"
          >
            <span
              className={cn(
                'truncate',
                !currentValue && 'text-foreground font-medium text-sm'
              )}
            >
              {currentValue
                ? brands.find((brand) => brand._id === currentValue)?.name
                : 'Select brand'}
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
        >
          <Command id="brand-command-menu">
            <Command.Input placeholder="Search brand..." className="h-9" />
            <Command.List>
              <Command.Empty>No brand found.</Command.Empty>
              <Command.Group>
                {brands.map((brand) => (
                  <Command.Item
                    key={brand._id}
                    className="h-7 text-xs text-foreground"
                    value={brand._id}
                    onSelect={handleSelectBrand}
                  >
                    {brand.name}
                    {currentValue === brand._id && (
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
