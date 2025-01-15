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
import { IconCheck, IconChevronDown } from '@tabler/icons-react';

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
  className?: string;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
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
    onChange(categoryId);
    setOpen(false);
  };

  const renderCategoryButton = () => {
    if (loading)
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
        variant={'secondary'}
        asChild
        className="truncate h-8 hover:cursor-pointer bg-transparent border-none shadow-none"
        onClick={(e) => {
          setOpen(true);
          e.stopPropagation();
        }}
      >
        <div className="w-full flex justify-between">
          {currentValue ? (
            <div className="flex items-center gap-2">
              <Avatar>
                <Avatar.Image src={currentValue?.attachment?.url} />
                <Avatar.Fallback colorSeed={currentValue?._id}>
                  {currentValue?.name?.charAt(0)}
                </Avatar.Fallback>
              </Avatar>
              {currentValue?.name}
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
        </div>
      </Button>
    );
  };

  if (loading) return <Skeleton className="h-9 w-full" />;

  return (
    <div className={className}>
      <Popover
        modal
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
                  <Avatar>
                    <Avatar.Image src={category?.attachment?.url} />
                    <Avatar.Fallback colorSeed={category?._id}>
                      {category?.name?.charAt(0)}
                    </Avatar.Fallback>
                  </Avatar>
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
    </div>
  );
};
