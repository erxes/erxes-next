import { useState } from 'react';

import {
  Avatar,
  Combobox,
  Command,
  Popover,
  Skeleton,
  TextOverflowTooltip,
  cn,
} from 'erxes-ui';

import { useProductCategories } from '@/products/hooks/useProductCategories';

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
    (category) => category._id === value,
  );

  const handleSelectCategory = (categoryId: string) => {
    onChange(categoryId === value ? '' : categoryId);
    setOpen(false);
  };

  if (loading) return <Skeleton className="h-9 w-full" />;

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <Combobox.Trigger
        variant="outline"
        role="combobox"
        aria-expanded={open}
        aria-controls="category-command-menu"
        className={cn(
          'truncate h-8 rounded-md hover:cursor-pointer w-full justify-between',
          className,
        )}
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
          <Combobox.Value placeholder="Choose category" />
        )}
      </Combobox.Trigger>
      <Combobox.Content className="w-60">
        <Command id="category-command-menu" className="relative">
          <Command.Input
            variant="secondary"
            wrapperClassName="flex-auto"
            placeholder="Search category..."
            className="h-9"
          />
          <Command.List className="max-h-[300px] overflow-y-auto">
            <Combobox.Empty loading={loading} />
            {productCategories?.map((category: Category) => (
              <Command.Item
                key={category._id}
                value={category.name}
                className="h-7 text-xs"
                onSelect={() => handleSelectCategory(category._id)}
                title={category.name}
              >
                <Avatar>
                  <Avatar.Image src={category?.attachment?.url} />
                  <Avatar.Fallback colorSeed={category?._id}>
                    {category?.name?.charAt(0)}
                  </Avatar.Fallback>
                </Avatar>
                <TextOverflowTooltip className="ml-2" value={category.name} />
                <Combobox.Check checked={category._id === value} />
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </Combobox.Content>
    </Popover>
  );
};
