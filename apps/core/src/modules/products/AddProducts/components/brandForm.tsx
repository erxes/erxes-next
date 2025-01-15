'use client';
import { useState } from 'react';
import { cn } from 'erxes-ui/lib/utils';
import { Popover, Button, Command, Skeleton } from 'erxes-ui/components';
import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import { useBrands } from '@/products/hooks/useBrands';
interface BrandFormProps {
  values: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

export const BrandForm = ({ values, onChange, className }: BrandFormProps) => {
  const { brands, loading } = useBrands({});
  const [open, setOpen] = useState<boolean>(false);
  const currentValue = brands?.find((brand) => brand._id === values?.[0])?._id;
  const handleSelectBrand = (brandId: string) => {
    onChange([brandId]);
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
            asChild
            className="truncate h-8 hover:cursor-pointer rounded-md shadow-none"
            onClick={(e) => {
              setOpen(true);
              e.stopPropagation();
            }}
          >
            <div className="flex justify-between w-full">
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
            </div>
          </Button>
        </Popover.Trigger>
        <Popover.Content
          className="w-56 min-w-[var(--radix-popper-anchor-width)] border-input p-0"
          align="start"
        >
          <Command>
            <Command.Input placeholder="Search brand..." className="h-9" />
            <Command.List>
              <Command.Empty>No brand found.</Command.Empty>
              <Command.Group>
                {brands.map((brand) => (
                  <Command.Item
                    key={brand._id}
                    className="h-7 text-xs"
                    value={brand._id}
                    onSelect={(currentValue) => {
                      handleSelectBrand(currentValue);
                    }}
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
