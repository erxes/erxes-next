import { Combobox, Command, Popover } from 'erxes-ui';
import { useProducts } from '../hooks/useProducts';
import { useDebounce } from 'use-debounce';
import { useState } from 'react';
import { IProduct } from 'ui-modules';
import { ProductInline } from './ProductInline';

export const SelectProduct = ({
  value,
  onValueChange,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>(
    undefined,
  );

  const handleSelect = (product?: IProduct) => {
    setSelectedProduct(product);
    onValueChange?.(product?._id || '');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <Combobox.Trigger>
        <ProductInline productId={value} product={selectedProduct} />
      </Combobox.Trigger>
      <Combobox.Content>
        <SelectProductList handleSelect={handleSelect} />
      </Combobox.Content>
    </Popover>
  );
};

export const SelectProductList = ({
  handleSelect,
}: {
  handleSelect: (product?: IProduct) => void;
}) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const { loading, products, totalCount, handleFetchMore, error } = useProducts(
    {
      variables: {
        searchValue: debouncedSearch,
      },
    },
  );

  return (
    <Command shouldFilter={false}>
      <Command.Input value={search} onValueChange={setSearch} />
      <Command.List>
        <Combobox.Empty loading={loading} error={error} />
        {products?.map((product) => (
          <Command.Item
            key={product._id}
            value={product.name}
            onSelect={() => handleSelect(product)}
          >
            <ProductInline product={product} />
          </Command.Item>
        ))}
        <Combobox.FetchMore
          fetchMore={handleFetchMore}
          currentLength={products?.length || 0}
          totalCount={totalCount || 0}
        />
      </Command.List>
    </Command>
  );
};
