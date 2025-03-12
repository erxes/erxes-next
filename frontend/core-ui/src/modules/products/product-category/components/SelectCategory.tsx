import React, { useState } from 'react';

import { ApolloError } from '@apollo/client';
import { IconLoader, IconCheck } from '@tabler/icons-react';

import {
  Avatar,
  Button,
  ButtonProps,
  Command,
  Popover,
  Skeleton,
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
      <Popover.Content className="p-0" align="start">
        <Command className="outline-none">
          <Command.Input />
          <Command.List>
            <SelectCategoryEmptyHandler error={error} loading={loading} />
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
      </Popover.Content>
    </SelectTree>
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
      <div className="truncate flex-auto text-left">{name}</div>
      {!selected ? (
        productCount > 0 && (
          <div className="text-muted-foreground ml-auto">{productCount}</div>
        )
      ) : (
        <IconCheck className="ml-auto" />
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
