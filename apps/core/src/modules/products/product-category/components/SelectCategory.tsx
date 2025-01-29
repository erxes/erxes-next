import React, { useEffect, useState } from 'react';

import { ApolloError } from '@apollo/client';
import { IconLoader } from '@tabler/icons-react';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  Avatar,
  Button,
  ButtonProps,
  Command,
  Popover,
  Skeleton,
  Tooltip,
} from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';
import {
  SelectTreeArrow,
  SelectTreeIndentation,
} from 'erxes-ui/modules/select-tree/components/SelectTree';

import { useProductCategories } from '@/products/product-category/hooks/useProductCategories';
import { hideChildrenAtomFamily } from '@/products/product-category/states/ProductCategory';
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
>(({ onSelect, selected, open, setOpen, id, ...props }, ref) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryT>();
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
          <Command.Input />
          <Command.List>
            <SelectCategoryEmptyHandler error={error} loading={loading} />
            {productCategories?.map((category) => (
              <SelectCategoryItem
                key={category._id}
                id={id}
                category={category}
                selected={selectedCategory?._id === category._id}
                onSelect={handleSelect}
                hasChildren={
                  productCategories.find((c) => c.parentId === category._id) !==
                  undefined
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
  id,
}: {
  category: ProductCategoryT;
  selected: boolean;
  onSelect: (categoryId: string) => void;
  hasChildren: boolean;
  id?: string;
}) => {
  const { _id, code, name, order, parentId } = category;

  const [hideChildren, setHideChildren] = useRecoilState(
    hideChildrenAtomFamily(id || 'select-category')
  );

  useEffect(() => {
    setHideChildren(isHidden);
  }, [isHidden]);

  if (isHidden) return null;

  const handleHideChildren = () => {
    setHideChildren(!hideChildren);
  };

  return (
    <div className="flex items-center gap-1 px-1 max-w-full">
      <SelectTreeIndentation order={order} />
      {hasChildren && (
        <SelectTreeArrow isClosed={hideChildren} onClick={handleHideChildren} />
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
