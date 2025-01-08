import { CellContext } from '@tanstack/react-table';
import { ProductT } from '@/products/types/productTypes';
import { useProductCategories } from '@/products/hooks/useProductCategories';
import { useProductsEdit } from '@/products/hooks/useProductsEdit';
import {
  Avatar,
  Button,
  Skeleton,
  Command,
  Popover,
} from 'erxes-ui/components';
import { useRef, useState } from 'react';
import { cn } from 'erxes-ui/lib';
import { IconCheck } from '@tabler/icons-react';

export const CategoryCell = (info: CellContext<ProductT, any>) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const ref = useRef<HTMLButtonElement>(null);
  const { productCategories, loading } = useProductCategories({
    onCompleted({ productCategories }) {
      const currentCategory = productCategories.find(
        (category) => category._id === info.getValue()
      );
      setSelectedCategoryId(currentCategory?._id || '');
    },
  });
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [open, setOpen] = useState(false);

  const selectedCategory = productCategories?.find(
    (category) => category._id === selectedCategoryId
  );
  const { handleProductsEdit } = useProductsEdit();

  if (loading) return <Skeleton className="h-3 w-full" />;

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    handleProductsEdit({
      _id: info.row.original._id,
      categoryId,
    });
    setOpen(false);
  };

  const renderCategoryButton = () => {
    if (!selectedCategory) return <Skeleton className="h-3 w-full" />;
    return (
      <Button
        variant="secondary"
        size="sm"
        asChild
        className="truncate justify-start"
      >
        <div>
          <Avatar.Root>
            <Avatar.Image src={selectedCategory?.attachment?.url} />
            <Avatar.Fallback colorSeed={selectedCategory?._id}>
              {selectedCategory?.name?.charAt(0)}
            </Avatar.Fallback>
          </Avatar.Root>
          {selectedCategory?.name}
        </div>
      </Button>
    );
  };

  if (isInEditMode) {
    return (
      <Popover
        open={open}
        onOpenChange={(op) => {
          setOpen(op);
          setIsInEditMode(op);
        }}
      >
        <Popover.Trigger asChild>
          <Button
            variant="ghost"
            className={cn(
              'h-full w-full rounded-none justify-start relative',
              open && 'ring-inset ring-2'
            )}
            ref={ref}
          >
            {renderCategoryButton()}
          </Button>
        </Popover.Trigger>
        <Popover.Content className="w-[--radix-popper-anchor-width] p-0">
          <Command>
            <Command.Input placeholder="Search category..." className="h-8" />
            <Command.List className="styled-scroll overflow-x-auto">
              <Command.Empty>No category found</Command.Empty>
              {productCategories?.map((category) => (
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
                      category._id === selectedCategoryId
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover>
    );
  }

  return (
    <Button
      variant="ghost"
      className="h-full w-full rounded-none justify-start"
      onClick={() => {
        setIsInEditMode(true);
        setTimeout(() => ref.current?.focus());
      }}
    >
      {renderCategoryButton()}
    </Button>
  );
};
