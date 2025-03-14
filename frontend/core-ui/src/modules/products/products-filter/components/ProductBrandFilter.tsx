import { useQueryState } from 'nuqs';

import {
  Combobox,
  Command,
  Popover,
  TextOverflowTooltip,
} from 'erxes-ui/components';

import { useBrands } from '@/brands/hooks/useBrands';

export const ProductBrandFilterDropdown = ({ onOpenChange }: any) => {
  const [filter, setFilter] = useQueryState('brand');

  const { brands, loading } = useBrands({
    variables: {},
  });

  if (loading) return <></>;

  return (
    <Command>
      <Command.Input placeholder="Search brand" />
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
      <Combobox.Trigger>
        <Combobox.Value
          value={selectedBrand?.name}
          placeholder="Select brand"
        />
      </Combobox.Trigger>
      <Combobox.Content>
        <Command>
          <Command.Input placeholder="Search brand" />
          <Command.List>
            {brands.map((brand) => (
              <Command.Item
                key={brand._id}
                onSelect={() => {
                  setFilter(brand._id);
                }}
              >
                <TextOverflowTooltip value={brand.name} />
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </Combobox.Content>
    </Popover>
  );
};
