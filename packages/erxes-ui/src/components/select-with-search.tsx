'use client';
import { useState } from 'react';
import { Command, Popover, Label, Button } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib/utils';
import { Check, ChevronDown } from 'lucide-react';

const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
  {
    value: 'angular',
    label: 'Angular',
  },
  {
    value: 'vue',
    label: 'Vue.js',
  },
  {
    value: 'react',
    label: 'React',
  },
  {
    value: 'ember',
    label: 'Ember.js',
  },
  {
    value: 'gatsby',
    label: 'Gatsby',
  },
  {
    value: 'eleventy',
    label: 'Eleventy',
  },
  {
    value: 'solid',
    label: 'SolidJS',
  },
  {
    value: 'preact',
    label: 'Preact',
  },
  {
    value: 'qwik',
    label: 'Qwik',
  },
  {
    value: 'alpine',
    label: 'Alpine.js',
  },
  {
    value: 'lit',
    label: 'Lit',
  },
];
function SelectDemo() {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  return (
    <div className="space-y-2">
      <Label htmlFor="select-41">Select with search</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button
            id="select-41"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20"
          >
            <span className={cn('truncate', !value && 'text-muted-foreground')}>
              {value
                ? frameworks.find((framework) => framework.value === value)
                    ?.label
                : 'Select framework'}
            </span>
            <ChevronDown
              size={16}
              strokeWidth={2}
              className="shrink-0 text-muted-foreground/80"
              aria-hidden="true"
            />
          </Button>
        </Popover.Trigger>
        <Popover.Content
          className="w-full z-[60] min-w-[var(--radix-popper-anchor-width)] border-input p-0"
          align="start"
        >
          <Command className='z-[60]'>
            <Command.Input placeholder="Search framework..." />
            <Command.List>
              <Command.Empty>No framework found.</Command.Empty>
              <Command.Group>
                {frameworks.map((framework) => (
                  <Command.Item
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }}
                  >
                    {framework.label}
                    {value === framework.value && (
                      <Check size={16} strokeWidth={2} className="ml-auto" />
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
}

export { SelectDemo };