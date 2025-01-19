import { useProductCategories } from '@/products/hooks/useProductCategories';
import {
  Avatar,
  Button,
  Skeleton,
  Command,
  Popover,
} from 'erxes-ui/components';
import { useState } from 'react';
import { cn } from 'erxes-ui/lib/utils';
import { IconCheck, IconChevronDown } from '@tabler/icons-react';

interface Category {
  _id: string;
  name: string;
  attachment?: {
    url: string;
  };
}

interface CategoryFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const CategoryField: React.FC<CategoryFieldProps> = ({
  value,
  onChange,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const { productCategories, loading } = useProductCategories({});
  const currentValue = productCategories?.find(
    (category) => category._id === value
  );

  const handleSelectCategory = (categoryId: string) => {
    onChange(categoryId === value ? '' : categoryId);
    setOpen(false);
  };

  if (loading) return <Skeleton className="h-9 w-full" />;

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen} modal>
        <Popover.Trigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-controls="category-command-menu"
            className="truncate h-8 rounded-md hover:cursor-pointer shadow-none w-full justify-between"
          >
            {currentValue ? (
              <div className="flex items-center gap-2">
                <Avatar>
                  <Avatar.Image src={currentValue?.attachment?.url} />
                  <Avatar.Fallback colorSeed={currentValue?._id}>
                    {currentValue?.name?.charAt(0)}
                  </Avatar.Fallback>
                </Avatar>
                <span className="truncate">{currentValue?.name}</span>
              </div>
            ) : (
              <span className="text-foreground font-medium text-sm">
                Choose category
              </span>
            )}
            <IconChevronDown
              size={16}
              strokeWidth={2}
              className="shrink-0 text-foreground"
              aria-hidden="true"
            />
          </Button>
        </Popover.Trigger>
        <Popover.Content
          className="w-60 min-w-[var(--radix-popper-anchor-width)] border-input p-0"
          align="start"
          side="bottom"
          sideOffset={8}
        >
          <Command id="category-command-menu" className="relative">
            <Command.Input placeholder="Search category..." className="h-9" />
            <Command.List className="max-h-[300px] overflow-y-auto">
              <Command.Empty>No category found</Command.Empty>
              {productCategories?.map((category: Category) => (
                <Command.Item
                  key={category._id}
                  value={category.name}
                  className="h-7 text-xs"
                  onSelect={() => handleSelectCategory(category._id)}
                >
                  <Avatar>
                    <Avatar.Image src={category?.attachment?.url} />
                    <Avatar.Fallback colorSeed={category?._id}>
                      {category?.name?.charAt(0)}
                    </Avatar.Fallback>
                  </Avatar>
                  <span className="ml-2">{category.name}</span>
                  <IconCheck
                    size={16}
                    strokeWidth={2}
                    className={cn(
                      'ml-auto',
                      category._id === value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover>
    </div>
  );
};
