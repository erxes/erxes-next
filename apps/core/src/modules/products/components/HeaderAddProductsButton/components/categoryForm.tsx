'use client';
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
import { IconCheck } from '@tabler/icons-react';

interface Category {
  _id: string;
  name: string;
  attachment?: {
    url: string;
  };
}

interface CategoryFormProps {
  value: string;
  onChange: (value: string) => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const { productCategories, loading } = useProductCategories({});

  const selectedCategory = productCategories?.find(
    (category) => category._id === value
  );

  const handleSelectCategory = (categoryId: string) => {
    onChange(categoryId);
    setOpen(false);
  };

  const renderCategoryButton = () => {
    if (!selectedCategory)
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
      <Button
        variant="secondary"
        size="sm"
        asChild
        className="truncate justify-start h-8"
        onClick={(e) => {
          setOpen(true);
          e.stopPropagation();
        }}
      >
        <div className="mx-2 ">
          <div className="py-2 flex gap-2">
            <Avatar.Root>
              <Avatar.Image src={selectedCategory?.attachment?.url} />
              <Avatar.Fallback colorSeed={selectedCategory?._id}>
                {selectedCategory?.name?.charAt(0)}
              </Avatar.Fallback>
            </Avatar.Root>
            {selectedCategory?.name}
          </div>
        </div>
      </Button>
    );
  };

  if (loading) return <Skeleton className="h-9 w-full" />;

  return (
    <Popover
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          setOpen(false);
        }
      }}
    >
      <Popover.Trigger asChild>{renderCategoryButton()}</Popover.Trigger>
      <Popover.Content
        className="w-60 min-w-[var(--radix-popper-anchor-width)] border-input p-0"
        align="start"
        side="bottom"
        sideOffset={8}
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="relative">
          <Command.Input
            placeholder="Search category..."
            className="h-9"
            onClick={(e) => e.stopPropagation()}
          />
          <Command.List className="max-h-[300px] overflow-y-auto">
            <Command.Empty>No category found</Command.Empty>
            {productCategories?.map((category: Category) => (
              <Command.Item
                key={category._id}
                value={category.name}
                className="h-7 text-xs"
                onSelect={() => handleSelectCategory(category._id)}
              >
                <Avatar.Root>
                  <Avatar.Image src={category?.attachment?.url} />
                  <Avatar.Fallback colorSeed={category?._id}>
                    {category?.name?.charAt(0)}
                  </Avatar.Fallback>
                </Avatar.Root>
                {category.name}
                <IconCheck
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
  );
};
