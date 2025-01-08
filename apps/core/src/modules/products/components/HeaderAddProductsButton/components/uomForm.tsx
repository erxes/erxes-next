'use client';
import { useState, FC } from 'react';
import { Button, Popover, Command, Skeleton } from 'erxes-ui/components';
import { IconCheck } from '@tabler/icons-react';
import { useUom } from '@/products/hooks/useUom';
import { cn } from 'erxes-ui/lib/utils';

interface UomFormProps {
  value: string;
  onChange: (value: string) => void;
}

export const UomForm: FC<UomFormProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { uoms, loading } = useUom({});
  const currentValue = uoms?.find((uom) => uom._id === value)?._id;
  const handleSelectUom = (uom: string) => {
    onChange(uom);
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
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
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
                    ? uoms.find((uom) => uom._id === currentValue)?.name
                    : 'Uom not selected'}
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
              <Command.Empty>No uom found.</Command.Empty>
              <Command.Group>
                {uoms.map((uom) => (
                  <Command.Item
                    key={uom._id}
                    className="h-7 text-xs"
                    value={uom._id}
                    onSelect={(currentValue) => {
                      handleSelectUom(currentValue);
                    }}
                  >
                    {uom.name}
                    {currentValue === uom._id && (
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
