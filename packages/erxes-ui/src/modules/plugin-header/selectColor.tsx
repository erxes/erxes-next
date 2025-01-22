import { colors } from 'erxes-ui/components/colors';
import { RadioGroup } from 'erxes-ui/components/radio-group';
import { useId } from 'react';

export function SelectColor() {
  const id = useId();
  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-medium leading-none text-foreground">
        Choose a color
      </legend>
      <RadioGroup className="flex gap-1.5 flex-wrap" defaultValue="blue">
        {colors.map((color) => (
          <RadioGroup.Item
            key={color}
            value={color}
            id={`${id}-${color}`}
            aria-label={color}
            style={
              {
                '--radix-foreground': `hsl(var(--radix-${color}-foreground))`,
                '--radix-background': `hsl(var(--radix-${color}))`,
              } as React.CSSProperties
            }
            className={`size-6 bg-[var(--radix-foreground)] shadow-none data-[state=checked]:border-[var(--radix-foreground)] data-[state=checked]:bg-[var(--radix-foreground)]`}
          />
        ))}
      </RadioGroup>
    </fieldset>
  );
}
