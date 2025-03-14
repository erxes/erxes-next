import React, { useState } from 'react';

import {
  Avatar,
  ButtonProps,
  Combobox,
  Command,
  Popover,
  Skeleton,
  TextOverflowTooltip,
} from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';
import { SelectTree } from 'erxes-ui/modules/select-tree/components/SelectTree';

import { useProductCategories } from '@/products/product-category/hooks/useProductCategories';
import { ProductCategoryT } from '@/products/types/productTypes';

export const SelectCategory = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    selected?: string;
    onSelect: (categoryId: string) => void;
    open?: boolean;
    setOpen?: (open: boolean) => void;
    id?: string;
  }
>(({ onSelect, selected, id, ...props }, ref) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryT>();
  const { productCategories, error, loading } = useProductCategories({
    onCompleted: ({
      productCategories,
    }: {
      productCategories: ProductCategoryT[];
    }) => {
      setSelectedCategory(
        productCategories?.find(
          (category: ProductCategoryT) => category._id === selected,
        ),
      );
    },
  });

  const handleSelect = (categoryId: string) => {
    const category = productCategories?.find(
      (category: ProductCategoryT) => category._id === categoryId,
    );
    setSelectedCategory(category);
    onSelect(categoryId);
  };

  return (
    <SelectTree id={id || 'select-category'}>
      <SelectCategoryTrigger
        ref={ref}
        {...props}
        selectedCategory={selectedCategory}
        loading={loading}
      />
      <Combobox.Content align="start">
        <Command className="outline-none">
          <Command.Input />
          <Command.List>
            <Combobox.Empty error={error} loading={loading} />
            {productCategories?.map((category: ProductCategoryT) => (
              <SelectCategoryItem
                key={category._id}
                category={category}
                selected={selectedCategory?._id === category._id}
                onSelect={handleSelect}
                hasChildren={
                  productCategories.find(
                    (c: ProductCategoryT) => c.parentId === category._id,
                  ) !== undefined
                }
              />
            ))}
          </Command.List>
        </Command>
      </Combobox.Content>
    </SelectTree>
  );
});

export const SelectCategoryItem = ({
  category,
  selected,
  onSelect,
  hasChildren,
}: {
  category: ProductCategoryT;
  selected: boolean;
  onSelect: (categoryId: string) => void;
  hasChildren: boolean;
}) => {
  const { _id, code, name, order } = category;

  return (
    <SelectTree.Item
      order={order}
      hasChildren={hasChildren}
      name={name}
      value={code + name}
      onSelect={() => onSelect(_id)}
      selected={selected}
    >
      <SelectCategoryBadge category={category} selected={selected} />
    </SelectTree.Item>
  );
};

export const SelectCategoryBadge = ({
  category,
  selected,
}: {
  category?: ProductCategoryT;
  selected?: boolean;
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
      <TextOverflowTooltip value={name} />
      {!selected ? (
        productCount > 0 && (
          <div className="text-muted-foreground ml-auto">{productCount}</div>
        )
      ) : (
        <Combobox.Check checked={selected} />
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
      <Combobox.Trigger
        ref={ref}
        className={cn('shadow-none min-w-56 justify-start', className)}
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
      </Combobox.Trigger>
    </Popover.Trigger>
  );
});
