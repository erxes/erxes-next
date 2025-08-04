import {
  cn,
  Combobox,
  Command,
  Filter,
  Form,
  Popover,
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTablePopover,
  useFilterContext,
  useQueryState,
  Avatar,
  TextOverflowTooltip,
} from 'erxes-ui';
import { useCategoriesWithSearch } from '../hooks/useCategoriesWithSearch';
import { IProductCategory } from '../types/category';
import { useDebounce } from 'use-debounce';
import React, { useState } from 'react';
import {
  SelectProductCategoryContext,
  useSelectProductCategoryContext,
} from '../../contexts/SelectProductCategoryContext';
import { CategoriesInline } from './CategoriesInline';
import { IconCategory } from '@tabler/icons-react';

export const SelectCategoryBadge = ({
  category,
  selected,
}: {
  category?: IProductCategory;
  selected?: boolean;
}) => {
  if (!category) return null;
  const { attachment, avatar, code, name, productCount } = category;
  const firstLetter = name.charAt(0);
  const imageUrl = attachment?.url || avatar?.url;

  return (
    <>
      <div className="flex items-center gap-2 flex-auto overflow-hidden justify-start">
        <Avatar>
          <Avatar.Image src={imageUrl} />
          <Avatar.Fallback>{firstLetter}</Avatar.Fallback>
        </Avatar>
        <div className="text-muted-foreground">{code}</div>
        <TextOverflowTooltip value={name} className="flex-auto" />
      </div>
      {!selected ? (
        productCount > 0 && (
          <div className="text-muted-foreground ml-auto">{productCount}</div>
        )
      ) : (
        <Combobox.Check checked={selected} />
      )}
    </>
  );
};

export const SelectCategoryProvider = ({
  children,
  mode = 'single',
  value,
  onValueChange,
  categories,
}: {
  children: React.ReactNode;
  mode?: 'single' | 'multiple';
  value?: string[] | string;
  onValueChange: (value: string[] | string) => void;
  categories?: IProductCategory[];
}) => {
  const [_categories, setCategories] = useState<IProductCategory[]>(
    categories || [],
  );
  const isSingleMode = mode === 'single';

  const onSelect = (category: IProductCategory) => {
    if (!category) return;
    if (isSingleMode) {
      setCategories([category]);
      return onValueChange?.(category._id);
    }

    const arrayValue = Array.isArray(value) ? value : [];

    const isCategorySelected = arrayValue.includes(category._id);
    const newSelectedCategoryIds = isCategorySelected
      ? arrayValue.filter((id) => id !== category._id)
      : [...arrayValue, category._id];

    setCategories((prev) =>
      [...prev, category].filter((c) => newSelectedCategoryIds.includes(c._id)),
    );
    onValueChange?.(newSelectedCategoryIds);
  };

  return (
    <SelectProductCategoryContext.Provider
      value={{
        categories: _categories,
        categoryIds: !value ? [] : Array.isArray(value) ? value : [value],
        onSelect,
        setCategories,
        loading: false,
        error: null,
      }}
    >
      {children}
    </SelectProductCategoryContext.Provider>
  );
};

const SelectCategoryValue = ({ placeholder }: { placeholder?: string }) => {
  const { categoryIds, categories, setCategories } =
    useSelectProductCategoryContext();
  return (
    <CategoriesInline
      categoryIds={categoryIds}
      categories={categories}
      updateCategories={setCategories}
      placeholder={placeholder}
    />
  );
};

const SelectCategoryCommandItem = ({
  category,
}: {
  category: IProductCategory;
}) => {
  const { onSelect, categoryIds } = useSelectProductCategoryContext();

  return (
    <Command.Item
      value={category._id}
      onSelect={() => {
        onSelect(category);
      }}
    >
      <SelectCategoryBadge category={category} />
      <Combobox.Check checked={categoryIds.includes(category._id)} />
    </Command.Item>
  );
};

const SelectCategoryContent = () => {
  const [search, setSearch] = React.useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const { categories: selectedCategories } = useSelectProductCategoryContext();

  const {
    categories = [],
    loading,
    handleFetchMore,
    totalCount = 0,
  } = useCategoriesWithSearch({
    variables: {
      searchValue: debouncedSearch,
    },
  });
  return (
    <Command shouldFilter={false} id="category-command-menu">
      <Command.Input
        value={search}
        onValueChange={setSearch}
        variant="secondary"
        wrapperClassName="flex-auto"
        placeholder="Search category..."
        className="h-9"
      />
      <Command.List>
        <Combobox.Empty loading={loading} />
        {selectedCategories.length > 0 && (
          <>
            {selectedCategories?.map((category) => (
              <SelectCategoryCommandItem
                key={category._id}
                category={category}
              />
            ))}
            <Command.Separator className="my-1" />
          </>
        )}
        {categories
          .filter(
            (category) =>
              !selectedCategories.some((c) => c._id === category._id),
          )
          .map((category) => (
            <SelectCategoryCommandItem key={category._id} category={category} />
          ))}
        <Combobox.FetchMore
          fetchMore={handleFetchMore}
          totalCount={totalCount}
          currentLength={categories.length}
        />
      </Command.List>
    </Command>
  );
};

export const SelectCategoryFilterItem = () => {
  return (
    <Filter.Item value="category">
      <IconCategory />
      Category
    </Filter.Item>
  );
};

export const SelectCategoryFilterView = ({
  onValueChange,
  queryKey,
  mode = 'single',
}: {
  onValueChange?: (value: string[] | string) => void;
  queryKey?: string;
  mode?: 'single' | 'multiple';
}) => {
  const [category, setCategory] = useQueryState<string[] | string>(
    queryKey || 'category',
  );
  const { resetFilterState } = useFilterContext();

  return (
    <Filter.View filterKey={queryKey || 'category'}>
      <SelectCategoryProvider
        mode={mode}
        value={category || (mode === 'single' ? '' : [])}
        onValueChange={(value) => {
          setCategory(value as string[] | string);
          resetFilterState();
          onValueChange?.(value);
        }}
      >
        <SelectCategoryContent />
      </SelectCategoryProvider>
    </Filter.View>
  );
};

export const SelectCategoryFilterBar = ({
  iconOnly,
  onValueChange,
  queryKey,
  mode = 'single',
}: {
  iconOnly?: boolean;
  onValueChange?: (value: string[] | string) => void;
  queryKey?: string;
  mode?: 'single' | 'multiple';
}) => {
  const [category, setCategory] = useQueryState<string[] | string>(
    queryKey || 'category',
  );
  const [open, setOpen] = useState(false);

  if (!category) {
    return null;
  }
  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconCategory />
        {!iconOnly && 'Category'}
      </Filter.BarName>
      <SelectCategoryProvider
        mode={mode}
        value={category || (mode === 'single' ? '' : [])}
        onValueChange={(value) => {
          if (value.length > 0) {
            setCategory(value as string[] | string);
          } else {
            setCategory(null);
          }
          setOpen(false);
          onValueChange?.(value);
        }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Filter.BarButton filterKey={queryKey || 'category'}>
              <SelectCategoryValue />
            </Filter.BarButton>
          </Popover.Trigger>
          <Combobox.Content>
            <SelectCategoryContent />
          </Combobox.Content>
        </Popover>
      </SelectCategoryProvider>
      <Filter.BarClose filterKey={queryKey || 'category'} />
    </Filter.BarItem>
  );
};

export const SelectCategoryInlineCell = ({
  onValueChange,
  scope,
  ...props
}: Omit<React.ComponentProps<typeof SelectCategoryProvider>, 'children'> & {
  scope?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectCategoryProvider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...props}
    >
      <RecordTablePopover open={open} onOpenChange={setOpen} scope={scope}>
        <RecordTableCellTrigger>
          <SelectCategoryValue placeholder={''} />
        </RecordTableCellTrigger>
        <RecordTableCellContent>
          <SelectCategoryContent />
        </RecordTableCellContent>
      </RecordTablePopover>
    </SelectCategoryProvider>
  );
};

export const SelectCategoryFormItem = ({
  onValueChange,
  className,
  placeholder,
  ...props
}: Omit<React.ComponentProps<typeof SelectCategoryProvider>, 'children'> & {
  className?: string;
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectCategoryProvider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Form.Control>
          <Combobox.Trigger className={cn('w-full shadow-xs', className)}>
            <SelectCategoryValue placeholder={placeholder} />
          </Combobox.Trigger>
        </Form.Control>

        <Combobox.Content>
          <SelectCategoryContent />
        </Combobox.Content>
      </Popover>
    </SelectCategoryProvider>
  );
};

SelectCategoryFormItem.displayName = 'SelectCategoryFormItem';

const SelectCategoryRoot = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<React.ComponentProps<typeof SelectCategoryProvider>, 'children'> &
    React.ComponentProps<typeof Combobox.Trigger> & {
      placeholder?: string;
    }
>(({ onValueChange, className, mode, value, placeholder, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectCategoryProvider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      mode={mode}
      value={value}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Combobox.Trigger
          ref={ref}
          className={cn('w-full inline-flex', className)}
          variant="outline"
          {...props}
        >
          <SelectCategoryValue placeholder={placeholder} />
        </Combobox.Trigger>
        <Combobox.Content>
          <SelectCategoryContent />
        </Combobox.Content>
      </Popover>
    </SelectCategoryProvider>
  );
});

SelectCategoryRoot.displayName = 'SelectCategoryRoot';

export const SelectCategory = Object.assign(SelectCategoryRoot, {
  Provider: SelectCategoryProvider,
  Value: SelectCategoryValue,
  Content: SelectCategoryContent,
  Badge: SelectCategoryBadge,
  FilterItem: SelectCategoryFilterItem,
  FilterView: SelectCategoryFilterView,
  FilterBar: SelectCategoryFilterBar,
  InlineCell: SelectCategoryInlineCell,
  FormItem: SelectCategoryFormItem,
});
