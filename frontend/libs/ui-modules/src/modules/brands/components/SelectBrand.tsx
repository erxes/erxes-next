import React, { ReactNode, useState } from 'react';
import { IBrand } from '../types';
import { SelectBrandContext } from '../contexts/SelectBrandContext';
import { cn, Combobox, Command, Popover, TextOverflowTooltip } from 'erxes-ui';
import { useSelectBrandContext } from '../hooks/useSelectBrandContext';
import { useBrands } from '../hooks/useBrands';
import { useBrandById } from '../hooks/useBrandById';

const SelectBrandProvider = ({
  children,
  value,
  onValueChange,
}: {
  children: ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}) => {
  const [brandId, setBrandId] = useState<string>();
  const [brand, setBrand] = useState<IBrand>();

  const onSelect = (brand: IBrand) => {
    if (!brand) return;

    setBrand(brand);
    return onValueChange?.(brand._id);
  };
  return (
    <SelectBrandContext.Provider
      value={{
        selectedBrandId: brandId || value,
        selectedBrand: brand,
        onSelect,
        setSelectedBrandId: setBrandId,
      }}
    >
      {children}
    </SelectBrandContext.Provider>
  );
};

const SelectBrandValue = ({
  placeholder,
  value,
}: {
  placeholder?: string;
  value: string | undefined;
}) => {
  const { selectedBrand } = useSelectBrandContext();
  const { brand, loading } = useBrandById({
    variables: {
      id: value || selectedBrand?._id,
    },
  });
  return <Combobox.Value placeholder={placeholder} value={brand.name} />;
};

const SelectBrandItem = ({
  value,
  onValueChange,
  selected,
}: {
  value: IBrand;
  onValueChange: (value: string) => void;
  selected?: boolean | undefined;
}) => {
  const { onSelect } = useSelectBrandContext();
  return (
    <Command.Item
      value={value.name}
      onSelect={() => {
        onSelect?.(value);
        onValueChange(value._id);
      }}
    >
      <SelectBrandBadge value={value} selected={selected} />
    </Command.Item>
  );
};

const SelectBrandBadge = ({
  value,
  selected,
}: {
  value?: IBrand;
  selected?: boolean;
}) => {
  if (!value) return;
  return (
    <>
      <div className="flex items-center gap-2 flex-auto overflow-hidden justify-start">
        <div className="text-muted-foreground">{value.code}</div>
        <TextOverflowTooltip value={value.name} className="flex-auto" />
      </div>
      {!selected ? (
        value.memberIds?.length > 0 && (
          <div className="text-muted-foreground ml-auto">
            {value.memberIds?.length}
          </div>
        )
      ) : (
        <Combobox.Check checked={selected} />
      )}
    </>
  );
};

const BrandsList = ({
  renderItem,
}: {
  renderItem: (brand: IBrand) => React.ReactNode;
}) => {
  const { brands, loading, error } = useBrands();
  return (
    <Command>
      <Command.Input placeholder="Search brand" />
      <Command.List>
        <Combobox.Empty loading={loading} error={error} />
        {brands && brands?.map((brand: IBrand) => renderItem(brand))}
      </Command.List>
    </Command>
  );
};

export const SelectBrand = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  React.ComponentPropsWithoutRef<typeof Combobox.Trigger> & {
    value?: string;
    onValueChange?: (value: string) => void;
  }
>(({ value, onValueChange, ...props }, ref) => {
  const [_open, _setOpen] = useState<boolean>(false);
  return (
    <SelectBrandProvider>
      <Popover open={_open} onOpenChange={_setOpen}>
        <Combobox.Trigger
          {...props}
          ref={ref}
          className={cn('w-full flex text-left', props.className)}
        >
          <SelectBrandValue placeholder="Select brand" value={value} />
        </Combobox.Trigger>
        <Combobox.Content>
          <BrandsList
            renderItem={(brand) => (
              <SelectBrandItem
                key={brand._id}
                value={brand}
                onValueChange={(value) => {
                  onValueChange?.(value);
                  _setOpen(false);
                }}
                selected={brand._id === value}
              />
            )}
          />
        </Combobox.Content>
      </Popover>
    </SelectBrandProvider>
  );
});
