import { IconCheck, IconCirclePlus } from '@tabler/icons-react';

import { cn } from 'erxes-ui/lib';

import { Badge } from './badge';
import { Button } from './button';
import { Command } from './command';
import { Popover } from './popover';
import { Separator } from './separator';

interface IFacetedFilter {
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: (props: { className: string }) => JSX.Element;
  }[];
  onSelect?: (value: string[]) => void;
  values?: string[];
  className?: string;
}

export function FacetedFilter({
  onSelect,
  title,
  options,
  values,
  className,
}: IFacetedFilter) {
  const vals = values || [];
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-10 w-full justify-start border-dashed shadow-none',
            className
          )}
          type="button"
        >
          <IconCirclePlus className="mr-2 h-4 w-4" />
          {title}
          {(values || []).length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                color="plum"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {vals.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {vals.length > 2 ? (
                  <Badge color="plum" className="rounded-sm px-1 font-normal">
                    {vals.length} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => vals.includes(option.value))
                    .map((option) => (
                      <Badge
                        color="plum"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Content className="w-[200px] p-0" align="start">
        <Command>
          <Command.Input placeholder={title} />
          <Command.List>
            <Command.Empty>No results found.</Command.Empty>
            <Command.Group>
              {options.map((option) => {
                const isSelected = vals.includes(option.value);
                return (
                  <Command.Item
                    key={option.value}
                    onSelect={() =>
                      onSelect &&
                      (isSelected
                        ? onSelect(vals.filter((val) => val !== option.value))
                        : onSelect([...vals, option.value]))
                    }
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <IconCheck className={cn('h-4 w-4')} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {/* {option.value && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {option.value}
                      </span>
                    )} */}
                  </Command.Item>
                );
              })}
            </Command.Group>
            {vals.length > 0 && (
              <>
                <Command.Separator />
                <Command.Group>
                  <Command.Item
                    onSelect={() => onSelect && onSelect([])}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </Command.Item>
                </Command.Group>
              </>
            )}
          </Command.List>
        </Command>
      </Popover.Content>
    </Popover>
  );
}
