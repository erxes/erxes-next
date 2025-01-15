import { useBrands } from '@/products/hooks/useBrands';
import { Button, Command, Popover } from 'erxes-ui/components';
import { useQueryState } from 'nuqs';
import { Item as DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { IconChevronLeft } from '@tabler/icons-react';

export const ProductBrandFilterDropdown = ({ onOpenChange }: any) => {
  const [filter, setFilter] = useQueryState('brand');

  const { brands, loading } = useBrands({
    variables: {},
  });

  if (loading) return <>loading...</>;

  return (
    <Command>
      <Command.Input placeholder="Search brand" variant="secondary" />
      <Command.List>
        {brands.map((brand) => (
          <Command.Item
            value={brand.code + brand.name}
            key={brand._id}
            onSelect={() => {
              setFilter(brand._id);
              onOpenChange(false);
            }}
          >
            {brand.name}
          </Command.Item>
        ))}
      </Command.List>
    </Command>
  );
};

export const ProductBrandFilterBar = () => {
  const [filter, setFilter] = useQueryState('brand');
  const { brands, loading } = useBrands({
    variables: {},
  });

  if (loading) return <></>;

  const selectedBrand = brands.find((brand) => brand._id === filter);

  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="ghost" className="px-2 bg-white rounded-none">
          {selectedBrand?.name || 'Select brand'}
        </Button>
      </Popover.Trigger>
      <Popover.Content className="p-0">
        <Command>
          <Command.Input placeholder="Search brand" variant="secondary" />
          <Command.List>
            {brands.map((brand) => (
              <Command.Item
                key={brand._id}
                onSelect={() => {
                  setFilter(brand._id);
                }}
              >
                {brand.name}
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </Popover.Content>
    </Popover>
  );
};
