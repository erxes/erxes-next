'use client';

import { useState } from 'react';
import { Popover } from 'erxes-ui/components/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { ICONS } from '@/knowledgebase/constants'; // adjust path as needed
import { Button } from 'erxes-ui';
import { PopoverContent } from '@radix-ui/react-popover';
import { Command } from 'erxes-ui';
import { IconCheck } from '@tabler/icons-react';

interface IconPickerProps {
  value?: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const icon = ICONS.find((icon) => icon.value === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-start"
        >
          {icon ? (
            <div className="flex items-center gap-2">
              <icon.icon className="w-5 h-5" />
              <span className="capitalize">{icon.label}</span>
            </div>
          ) : (
            <span>Select icon...</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 max-h-64 overflow-auto">
        <Command>
          <Command.Input placeholder="Search icons..." className="h-9" />
          <div className="max-h-52 overflow-y-auto">
            <Command.Group>
              {ICONS.map((item) => (
                <Command.Item
                  key={item.value}
                  value={item.value}
                  onSelect={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-5 h-5" />
                    <span className="capitalize">{item.label}</span>
                  </div>
                  {icon?.value === item.value && (
                    <IconCheck className="ml-auto h-4 w-4 opacity-100" />
                  )}
                </Command.Item>
              ))}
            </Command.Group>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
