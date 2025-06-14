'use client';

import { icons } from 'lucide-react';
import { Popover } from './popover';
import { Button } from './button';
import { Input } from './input';
import { ScrollArea } from './scroll-area';
import { cn } from '../lib/utils';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';
import { PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';

type IconPickerProps = {
  value: string | null;
  onChange: (iconName: string) => void;
};

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [search, setSearch] = useState('');

  const filteredIcons = Object.keys(icons).filter((iconName) =>
    iconName.toLowerCase().includes(search.toLowerCase()),
  );

  const SelectedIcon = value ? LucideIcons[value] : null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-start">
          {SelectedIcon ? <SelectedIcon className="mr-2 h-4 w-4" /> : null}
          {value || 'Select icon'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-2 bg-popover text-popover-foreground border rounded-md shadow-md">
        <Input
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />
        <ScrollArea className="h-[200px]">
          <div className="grid grid-cols-5 gap-2">
            {filteredIcons.map((iconName) => {
              const IconComponent = LucideIcons[iconName as keyof typeof icons];
              return (
                <button
                  key={iconName}
                  onClick={() => onChange(iconName as keyof typeof icons)}
                  className={cn(
                    'flex items-center justify-center p-2 rounded hover:bg-muted',
                    value === iconName && 'bg-muted',
                  )}
                  title={iconName}
                >
                  <IconComponent className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
