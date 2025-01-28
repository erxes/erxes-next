import {
  Popover,
  Button,
  ButtonProps,
  Command,
  Avatar,
  Skeleton,
  Tooltip,
} from 'erxes-ui/components';
import React, { useState } from 'react';
import { useProductCategories } from '@/products/product-category/hooks/useProductCategories';
import { ProductCategoryT } from '@/products/types/productTypes';
import { cn } from 'erxes-ui/lib';
import { IconCaretDownFilled, IconLoader } from '@tabler/icons-react';
import { ApolloError } from '@apollo/client';

export const SelectCategory = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    selected?: string;
    onSelect: (categoryId: string) => void;
    open?: boolean;
    setOpen?: (open: boolean) => void;
  }
>(({ onSelect, selected, open, setOpen, ...props }, ref) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryT>();
  const [hideChildren, setHideChildren] = useState<string[]>([]);
  const { productCategories, error, loading } = useProductCategories({
    onCompleted: ({ productCategories }) => {
      setSelectedCategory(
        productCategories?.find((category) => category._id === selected)
      );
    },
  });

  const handleSelect = (categoryId: string) => {
    const category = productCategories?.find(
      (category) => category._id === categoryId
    );
    setSelectedCategory(category);
    onSelect(categoryId);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <SelectCategoryTrigger
        ref={ref}
        {...props}
        selectedCategory={selectedCategory}
        loading={loading}
      />
      <Popover.Content className="p-0" align="start">
        <Command className="outline-none">
          <Command.Input variant="secondary" />
          <Command.List>
            <SelectCategoryEmptyHandler error={error} loading={loading} />
            {productCategories?.map((category) => (
              <SelectCategoryItem
                key={category._id}
                category={category}
                selected={selectedCategory?._id === category._id}
                onSelect={handleSelect}
                hasChildren={
                  productCategories.find((c) => c.parentId === category._id) !==
                  undefined
                }
                hideChildren={hideChildren}
                setHideChildren={setHideChildren}
                parentName={
                  productCategories.find((c) => c._id === category.parentId)
                    ?.name
                }
              />
            ))}
          </Command.List>
        </Command>
      </Popover.Content>
    </Popover>
  );
});

export const SelectCategoryEmptyHandler = ({
  error,
  loading,
}: {
  error?: ApolloError;
  loading: boolean;
}) => {
  if (loading)
    return (
      <Command.Empty>
        <div className="flex items-center justify-center h-full">
          <IconLoader className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      </Command.Empty>
    );
  if (error) return <Command.Empty>{error.message}</Command.Empty>;
  return (
    <Command.Empty>
      <p className="text-muted-foreground pb-2">No results found.</p>
    </Command.Empty>
  );
};

export const SelectCategoryItem = ({
  category,
  selected,
  onSelect,
  hasChildren,
  hideChildren,
  setHideChildren,
  parentName,
}: {
  category: ProductCategoryT;
  selected: boolean;
  onSelect: (categoryId: string) => void;
  hasChildren: boolean;
  hideChildren: string[];
  setHideChildren: (hideChildren: string[]) => void;
  parentName: string;
}) => {
  const { _id, code, name, order, parentId } = category;
  const indentationLevel = (order?.match(/[/]/gi)?.length || 0) - 1;

  if (hideChildren.includes(parentId)) return null;

  return (
    <div className="flex items-center gap-1 px-1 max-w-full">
      {indentationLevel > 0 && (
        <div className="flex h-full gap-[22px] px-[13px]  ">
          {Array.from({ length: indentationLevel }).map((_, index) => (
            <div key={index} className="relative">
              <div className="absolute -top-3.5 h-7 w-px bg-muted-foreground/20" />
            </div>
          ))}
        </div>
      )}
      {hasChildren && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setHideChildren(
              hideChildren.includes(_id)
                ? hideChildren.filter((catId) => catId !== _id)
                : [...hideChildren, _id]
            )
          }
        >
          <IconCaretDownFilled
            className={cn(
              'transition-transform',
              hideChildren.includes(_id) && '-rotate-90'
            )}
          />
        </Button>
      )}
      <Tooltip.Provider>
        <Tooltip>
          <Tooltip.Trigger className="flex-auto">
            <Command.Item
              key={_id}
              value={code + name}
              onSelect={() => onSelect(_id)}
              className={cn(
                'flex-auto whitespace-nowrap',
                selected && 'bg-muted'
              )}
            >
              <SelectCategoryBadge category={category} />
            </Command.Item>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <div>{name}</div>
          </Tooltip.Content>
        </Tooltip>
      </Tooltip.Provider>
    </div>
  );
};

export const SelectCategoryBadge = ({
  category,
}: {
  category?: ProductCategoryT;
}) => {
  if (!category) return null;
  const { _id, avatar, code, name, productCount } = category;
  const firstLetter = name.charAt(0);
  return (
    <>
      <Avatar>
        <Avatar.Image src={avatar?.url} />
        <Avatar.Fallback colorSeed={_id}>{firstLetter}</Avatar.Fallback>
      </Avatar>
      <div className="text-muted-foreground">{code}</div>
      <div className="truncate max-w-[160px] flex-none">{name}</div>
      {productCount > 0 && (
        <div className="text-muted-foreground ml-auto">{productCount}</div>
      )}
    </>
  );
};

export const SelectCategoryTrigger = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    selectedCategory: ProductCategoryT | undefined;
    loading: boolean;
  }
>(({ selectedCategory, loading, className, ...props }, ref) => {
  return (
    <Popover.Trigger asChild>
      <Button
        ref={ref}
        variant="outline"
        className={cn('shadow-none min-w-56 text-xs justify-start', className)}
        {...props}
      >
        <SelectCategoryBadge category={selectedCategory} />
        {loading && (
          <>
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-8 h-4" />
            <Skeleton className="w-16 h-4" />
          </>
        )}
      </Button>
    </Popover.Trigger>
  );
});
