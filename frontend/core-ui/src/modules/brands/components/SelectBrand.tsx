import {
  Button,
  ButtonProps,
  Command,
  Popover,
  Spinner,
} from 'erxes-ui/components';
import { useBrands } from '@/brands/hooks/useBrands';
import { IconCheck, IconChevronDown, IconLoader } from '@tabler/icons-react';
import { IBrand, SelectBrandFetchMoreProps } from '@/brands/types/brand';
import { useDebounce } from 'use-debounce';
import { useInView } from 'react-intersection-observer';
import React from 'react';
import { cn } from 'erxes-ui/lib';

interface SelectBrandProps extends Omit<ButtonProps, 'onChange'> {
  values: string[];
  onValueChange: (value: string[]) => void;
}

interface SelectBrandTriggerProps extends ButtonProps {
  currentValue: string;
  currentName: string;
}

export const SelectBrand = React.forwardRef<
  HTMLButtonElement,
  SelectBrandProps
>(({ values, onValueChange, ...props }, ref) => {
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

  const currentValue = brands?.find((brand) => brand._id === values?.[0])?._id;

  const handleSelectBrand = (brandId: string) => {
    onValueChange(brandId === currentValue ? [] : [brandId]);
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
      <Popover.Content
        className="w-56 min-w-[var(--radix-popper-anchor-width)] border-input p-0"
        align="start"
      >
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
            <SelectBrandEmpty loading={loading} />
            {brands?.map((brand) => (
              <SelectBrandItem
                key={brand._id}
                brand={brand}
                currentValue={currentValue || ''}
                handleSelectBrand={handleSelectBrand}
              />
            ))}
            <SelectBrandFetchMore
              fetchMore={handleFetchMore}
              totalCount={totalCount}
              brandsLength={brands.length}
            />
          </Command.List>
        </Command>
      </Popover.Content>
    </Popover>
  );
});

SelectBrand.displayName = 'SelectBrand';

const SelectBrandTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectBrandTriggerProps
>(({ currentName, currentValue, className, ...props }, ref) => {
  return (
    <Popover.Trigger asChild>
      <Button
        variant="outline"
        role="combobox"
        className={cn(
          'truncate h-8 hover:cursor-pointer rounded-md shadow-none w-full justify-between',
          className,
        )}
        ref={ref}
        {...props}
      >
        <span
          className={cn(
            'truncate',
            !currentValue && 'text-foreground font-medium text-sm',
          )}
        >
          {currentValue ? currentName : 'Select brand'}
        </span>
        <IconChevronDown
          size={16}
          strokeWidth={2}
          className="shrink-0 text-foreground"
          aria-hidden="true"
        />
      </Button>
    </Popover.Trigger>
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
      {currentValue === brand._id && (
        <IconCheck size={16} strokeWidth={2} className="ml-auto" />
      )}
    </Command.Item>
  );
};

const SelectBrandFetchMore: React.FC<SelectBrandFetchMoreProps> = ({
  fetchMore,
  brandsLength,
  totalCount,
}) => {
  const { ref: bottomRef } = useInView({
    onChange: (inView) => inView && fetchMore(),
  });

  if (!brandsLength || brandsLength >= totalCount) {
    return null;
  }

  return (
    <Command.Item value="-" disabled ref={bottomRef}>
      <IconLoader className="w-4 h-4 animate-spin text-muted-foreground mr-1" />
      Loading more...
    </Command.Item>
  );
};

interface SelectBrandEmptyProps {
  loading: boolean;
}

export const SelectBrandEmpty: React.FC<SelectBrandEmptyProps> = ({
  loading,
}) => {
  return (
    <Command.Empty>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Spinner size={'small'} />
        </div>
      ) : (
        <div>
          <p className="text-muted-foreground pb-2">No results found.</p>
        </div>
      )}
    </Command.Empty>
  );
};
