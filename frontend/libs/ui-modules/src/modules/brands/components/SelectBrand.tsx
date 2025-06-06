import { ButtonProps, Combobox, Command, Popover } from 'erxes-ui';
import { useBrands } from '../hooks/useBrands';
import { IBrand } from '../types/brand';
import { useDebounce } from 'use-debounce';
import React from 'react';
import { cn } from 'erxes-ui';

interface SelectBrandProps extends Omit<ButtonProps, 'onChange'> {
  value: string;
  onValueChange: (value: string) => void;
}

interface SelectBrandTriggerProps extends ButtonProps {
  currentValue: string;
  currentName: string;
}

export const SelectBrand = React.forwardRef<
  HTMLButtonElement,
  SelectBrandProps
>(({ value, onValueChange, ...props }, ref) => {
  console.log('value', value);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const {
    brands = [],
    loading,
    handleFetchMore,
    totalCount = 0,
  } = useBrands({
    variables: {
      searchValue: debouncedSearch,
    },
  });

  const currentValue = brands?.find((brand) => brand._id === value)?._id;

  const handleSelectBrand = (brandId: string) => {
    onValueChange(brandId === currentValue ? '' : brandId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <SelectBrandTrigger
        currentValue={currentValue || ''}
        currentName={
          brands.find((brand) => brand._id === currentValue)?.name || ''
        }
        ref={ref}
        {...props}
      />
      <Combobox.Content>
        <Command shouldFilter={false} id="brand-command-menu">
          <Command.Input
            value={search}
            onValueChange={setSearch}
            variant="secondary"
            wrapperClassName="flex-auto"
            placeholder="Search brand..."
            className="h-9"
          />
          <Command.List>
            <Combobox.Empty loading={loading} />
            {brands?.map((brand) => (
              <SelectBrandItem
                key={brand._id}
                brand={brand}
                currentValue={currentValue || ''}
                handleSelectBrand={handleSelectBrand}
              />
            ))}
            <Combobox.FetchMore
              fetchMore={() => handleFetchMore({})}
              totalCount={totalCount}
              currentLength={brands.length}
            />
          </Command.List>
        </Command>
      </Combobox.Content>
    </Popover>
  );
});

SelectBrand.displayName = 'SelectBrand';

// const SelectBrandCommand = () => {
//   const [search, setSearch] = React.useState('');
//   const [debouncedSearch] = useDebounce(search, 500);
//   const {
//     brands = [],
//     loading,
//     handleFetchMore,
//     totalCount = 0,
//   } = useBrands({
//     variables: {
//       searchValue: debouncedSearch,
//     },
//   });

//   return (
//     <Command shouldFilter={false} id="brand-command-menu">
//       <Command.Input
//         value={search}
//         onValueChange={setSearch}
//         variant="secondary"
//         wrapperClassName="flex-auto"
//         placeholder="Search brand..."
//         className="h-9"
//       />
//       <Command.List>
//         <Combobox.Empty loading={loading} />
//         {brands?.map((brand) => (
//           <SelectBrandItem
//             key={brand._id}
//             brand={brand}
//             currentValue={currentValue || ''}
//             handleSelectBrand={handleSelectBrand}
//           />
//         ))}
//         <Combobox.FetchMore
//           fetchMore={handleFetchMore}
//           totalCount={totalCount}
//           currentLength={brands.length}
//         />
//       </Command.List>
//     </Command>
//   );
// };

const SelectBrandTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectBrandTriggerProps
>(({ currentName, className, ...props }, ref) => {
  return (
    <Combobox.Trigger
      className={cn('w-full flex', className)}
      ref={ref}
      {...props}
    >
      <Combobox.Value
        value={currentName}
        placeholder="Select brand"
        className="truncate"
      />
    </Combobox.Trigger>
  );
});

SelectBrandTrigger.displayName = 'SelectBrandTrigger';

interface SelectBrandItemProps {
  brand: IBrand;
  handleSelectBrand: (brandId: string) => void;
  currentValue: string;
}

const SelectBrandItem: React.FC<SelectBrandItemProps> = ({
  brand,
  handleSelectBrand,
  currentValue,
}) => {
  return (
    <Command.Item
      key={brand._id}
      className="h-7"
      value={brand._id}
      onSelect={() => handleSelectBrand(brand._id)}
      title={brand.name}
    >
      <span className="text-xs text-foreground truncate">{brand.name}</span>
      <Combobox.Check checked={currentValue === brand._id} />
    </Command.Item>
  );
};
