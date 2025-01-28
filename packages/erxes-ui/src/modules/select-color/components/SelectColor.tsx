import { colors } from 'erxes-ui/components/colors';
import { RadioGroup } from 'erxes-ui/components/radio-group';
import { cn } from 'erxes-ui/lib/utils';
import { useId } from 'react';

interface SelectColorProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function SelectColor({
  defaultValue = 'blue',
  value,
  onValueChange,
  className,
}: SelectColorProps) {
  const id = useId();
  console.log(value);

  return (
    <fieldset className={cn('space-y-2', className)}>
      <legend className="text-xs font-mono font-semibold uppercase leading-none text-muted-foreground">
        Choose a color
      </legend>
      <RadioGroup
        defaultValue={defaultValue}
        value={value}
        onValueChange={onValueChange}
        className="flex flex-wrap gap-1.5"
      >
        <RadioGroup.Item
          value=""
          id={`${id}-empty`}
          aria-label="empty"
          className="size-6 bg-radix-foreground shadow-none data-[state=checked]:bg-muted relative before:h-full before:w-px before:bg-input before:absolute before:left-1/2 before:-translate-x-1/2 before:top-0 before:rotate-45"
        />
        {colors.map((color) => (
          <RadioGroup.Item
            key={color}
            value={color}
            id={`${id}-${color}`}
            aria-label={color}
            style={
              {
                '--radix-foreground': `var(--radix-${color}-foreground)`,
              } as React.CSSProperties
            }
            className="size-6 bg-radix-foreground shadow-none data-[state=checked]:border-radix-foreground data-[state=checked]:bg-radix-foreground"
          />
        ))}
      </RadioGroup>
    </fieldset>
  );
}
