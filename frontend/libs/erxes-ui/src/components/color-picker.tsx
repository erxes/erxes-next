import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import { Combobox, Popover, inputVariants } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';
import React from 'react';
import { IMaskInput } from 'react-imask';

export const ColorPicker = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  React.ComponentPropsWithoutRef<typeof Combobox.Trigger> & {
    value?: string;
    onValueChange?: (value: string) => void;
  }
>(({ value, onValueChange, className, ...props }, ref) => {
  const [open, setOpen] = React.useState(false);
  const COLORS = {
    red: '#dc2626',
    orange: '#f97316',
    amber: '#f59e0b',
    yellow: '#eab308',
    lime: '#84cc16',
    green: '#16a34a',
    emerald: '#059669',
    cyan: '#06b6d4',
    sky: '#0ea5e9',
    blue: '#2563eb',
    indigo: '#4f46e5',
    violet: '#7c3aed',
    purple: '#9333ea',
    fuchsia: '#c026d3',
    pink: '#db2777',
    rose: '#e11d48',
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Combobox.TriggerBase
        ref={ref}
        variant="outline"
        className={cn('pl-1 pr-2 h-7', className)}
        {...props}
      >
        <div
          className={cn('h-full w-full rounded', !value && 'bg-primary')}
          style={{ backgroundColor: value }}
        />
        <IconChevronDown />
      </Combobox.TriggerBase>
      <Popover.Content className="p-1 w-64" align="start" sideOffset={8}>
        <div className="grid grid-cols-5 gap-1">
          {Object.entries(COLORS).map(([key, color]) => (
            <div
              key={key}
              className="aspect-[3/2] rounded flex items-center justify-center"
              style={{ backgroundColor: color }}
              onClick={() => {
                onValueChange?.(color);
                setOpen(false);
              }}
            >
              {value === color && (
                <IconCheck className="h-4 w-4 text-primary-foreground" />
              )}
            </div>
          ))}
          <div className="relative col-span-5">
            <div
              className="absolute size-7 rounded-[3px] top-0.5 left-0.5 flex items-center justify-center text-primary-foreground"
              style={{ backgroundColor: value }}
            >
              <input
                type="color"
                value={value}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => onValueChange?.(e.target.value)}
              />
              #
            </div>
            <IMaskInput
              mask={/^[0-9A-Fa-f]+$/}
              className={cn(inputVariants(), 'pl-9')}
              value={value}
              onAccept={(value) => onValueChange?.('#' + value)}
            />
          </div>
        </div>
      </Popover.Content>
    </Popover>
  );
});
