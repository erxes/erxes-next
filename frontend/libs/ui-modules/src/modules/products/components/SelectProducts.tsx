import { SelectProductContext, useSelectProductContext } from '../contexts/SelectProductContext';
import { IProduct } from '../types/Product';
import { useProducts } from '../hooks/useProducts';
import { useDebounce } from 'use-debounce';
import { useState } from 'react';
import { cn, Combobox, Command, Popover } from 'erxes-ui';
import { ProductsInline } from './ProductsInline';
import {
  RecordTablePopover,
  RecordTableCellContent,
  RecordTableCellTrigger,
} from 'erxes-ui';

interface SelectProductProviderProps {
  children: React.ReactNode;
  value?: string[] | string;
  onValueChange?: (value: string[] | string) => void;
  mode?: 'single' | 'multiple';
}

const SelectProductsProvider = ({
  children,
  value,
  onValueChange,
  mode = 'single',
}: SelectProductProviderProps) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const productIds = !value ? [] : Array.isArray(value) ? value : [value];
  const onSelect = (product: IProduct) => {
    if (!product) return;
    if (mode === 'single') {
      setProducts([product]);
      onValueChange?.(product._id);
      return;
    }
    const arrayValue = Array.isArray(value) ? value : [];
    const isProductSelected = arrayValue.includes(product._id);
    const newSelectedProductIds = isProductSelected
      ? arrayValue.filter((id) => id !== product._id)
      : [...arrayValue, product._id];

    setProducts((prevProducts) => {
      const productMap = new Map(prevProducts.map((p) => [p._id, p]));
      productMap.set(product._id, product);
      return newSelectedProductIds
        .map((id) => productMap.get(id))
        .filter((p): p is IProduct => p !== undefined);
    });
    onValueChange?.(newSelectedProductIds);
  };
  return (
    <SelectProductContext.Provider
      value={{
        productIds,
        onSelect,
        products,
        setProducts,
        loading: false,
        error: null,
      }}
    >
      {children}
    </SelectProductContext.Provider>
  );
};

const SelectProductsContent = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const { productIds, products } = useSelectProductContext();
  const {
    products: productsData,
    loading,
    handleFetchMore,
    totalCount,
    error,
  } = useProducts({
    variables: {
      searchValue: debouncedSearch,
    },
  });
  return (
    <Command shouldFilter={false}>
      <Command.Input
        value={search}
        onValueChange={setSearch}
        variant="secondary"
        wrapperClassName="flex-auto"
        focusOnMount
      />
      <Command.List className="max-h-[300px] overflow-y-auto">
        {products?.length > 0 && (
          <>
            {products.map((product) => (
              <SelectProductCommandItem key={product._id} product={product} />
            ))}
            <Command.Separator className="my-1" />
          </>
        )}
        <Combobox.Empty loading={loading} error={error} />
        {!loading &&
          productsData
            ?.filter(
              (product) =>
                !productIds.find((productId) => productId === product._id),
            )
            .map((product) => (
              <SelectProductCommandItem key={product._id} product={product} />
            ))}

        {!loading && (
          <Combobox.FetchMore
            fetchMore={handleFetchMore}
            currentLength={productsData?.length || 0}
            totalCount={totalCount}
          />
        )}
      </Command.List>
    </Command>
  );
};

const SelectProductCommandItem = ({ product }: { product: IProduct }) => {
  const { onSelect, productIds } = useSelectProductContext();
  return (
    <Command.Item
      value={product._id}
      onSelect={() => {
        onSelect(product);
      }}
    >
      <ProductsInline products={[product]} placeholder="Unnamed product" />
      <Combobox.Check checked={productIds.includes(product._id)} />
    </Command.Item>
  );
};

const SelectProductInlineCell = ({
  onValueChange,
  scope,
  ...props
}: Omit<React.ComponentProps<typeof SelectProductsProvider>, 'children'> & {
  scope?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectProductsProvider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...props}
    >
      <RecordTablePopover open={open} onOpenChange={setOpen} scope={scope}>
        <RecordTableCellTrigger>
          <SelectProducts.Value />
        </RecordTableCellTrigger>
        <RecordTableCellContent>
          <SelectProducts.Content />
        </RecordTableCellContent>
      </RecordTablePopover>
    </SelectProductsProvider>
  );
};

const SelectProductRoot = ({
  onValueChange,
  className,
  mode = 'single',
  ...props
}: Omit<React.ComponentProps<typeof SelectProductsProvider>, 'children'> & {
  className?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <SelectProductsProvider
      onValueChange={(value) => {
        if (mode === 'single') {
          setOpen(false);
        }
        onValueChange?.(value);
      }}
      mode={mode}
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Combobox.Trigger
          className={cn('w-full inline-flex', className)}
          variant="outline"
        >
          <SelectProducts.Value />
        </Combobox.Trigger>
        <Combobox.Content>
          <SelectProducts.Content />
        </Combobox.Content>
      </Popover>
    </SelectProductsProvider>
  );
};

const SelectProductsValue = () => {
  const { productIds, products, setProducts } = useSelectProductContext();

  return (
    <ProductsInline
      productIds={productIds}
      products={products}
      updateProducts={setProducts}
    />
  );
};

export const SelectProducts = Object.assign(SelectProductRoot, {
  Provider: SelectProductsProvider,
  Content: SelectProductsContent,
  Item: SelectProductCommandItem,
  InlineCell: SelectProductInlineCell,
  Value: SelectProductsValue,
});
