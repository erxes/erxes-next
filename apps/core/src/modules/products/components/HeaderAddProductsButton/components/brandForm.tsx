'use client';
import { useState } from 'react';
import { cn } from 'erxes-ui/lib/utils';
import { Popover, Button, Command, Skeleton } from 'erxes-ui/components';
import { IconCheck } from '@tabler/icons-react';
import { useBrands } from '@/products/hooks/useBrands';
interface BrandFormProps {
  values: string[];
  onChange: (value: string[]) => void;
}

export const BrandForm = ({ values, onChange }: BrandFormProps) => {
  const { brands, loading } = useBrands({});
  const [open, setOpen] = useState<boolean>(false);
  const currentValue = brands?.find((brand) => brand._id === values?.[0])?._id;
  if (loading)
    return (
      <Skeleton
        className="truncate justify-start h-8 mr-1"
      >
        <div className="mx-2 w-full">
          <div className="py-2 flex gap-2">
            <div className="h-4 w-24" />
          </div>
        </div>
      </Skeleton>
    );
  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button
            variant="secondary"
            size="sm"
            asChild
            className="truncate justify-start h-8"
            onClick={(e) => {
              setOpen(true);
              e.stopPropagation();
            }}
          >
            <div className="mx-2 ">
              <div className="py-2 flex gap-2">
                <span
                  className={cn('truncate', !currentValue && 'text-foreground')}
                >
                  {currentValue
                    ? brands.find((brand) => brand._id === currentValue)?.name
                    : 'Brand not selected'}
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
            <Command.Input placeholder="Search brand..." className='h-9'/>
            <Command.List>
              <Command.Empty>No brand found.</Command.Empty>
              <Command.Group>
                {brands.map((brand) => (
                  <Command.Item
                    key={brand._id}
                    className="h-7 text-xs"
                    value={brand._id}
                    onSelect={(currentValue) => {
                      onChange([currentValue]);
                      setOpen(false);
                    }}
                  >
                    {brand.name}
                    {currentValue === brand.name && (
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
