'use client';
import { useState, FC } from 'react';
import {
  Skeleton,
  Select,
} from 'erxes-ui/components';
import { useUom } from '@/products/hooks/useUom';
import { cn } from 'erxes-ui/lib/utils';

interface UomFormProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const UomForm: FC<UomFormProps> = ({ value, onChange, className }) => {
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
    <div className={className}>
      <Select
        open={open}
        onOpenChange={setOpen}
        onValueChange={handleSelectUom}
        value={value}
      >
        <Select.Trigger className="truncate w-full justify-between text-foreground border-none h-8">
          <Select.Value
            placeholder={
              <span
                className={cn(
                  'truncate',
                  !currentValue && 'text-foreground font-medium text-sm'
                )}
              >
                {currentValue
                  ? uoms.find((uom) => uom._id === currentValue)?.name
                  : 'Choose UOM'}
              </span>
            }
          />
        </Select.Trigger>
        <Select.Content
          className="w-56 min-w-[var(--radix-popper-anchor-width)] border-input p-0 [&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2"
          align="start"
        >
          {uoms.map((uom) => (
            <Select.Item key={uom._id} className="h-7 text-xs" value={uom._id}>
              {uom.name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  );
};
