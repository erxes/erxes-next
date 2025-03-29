import {
  Combobox,
  Command,
  InlineCell,
  InlineCellDisplay,
  InlineCellEdit,
  SelectTree,
  TextOverflowTooltip,
} from 'erxes-ui';
import React, { useEffect, useRef, useState } from 'react';
import { useAccountCategories } from '../hooks/useAccountCategories';
import { IAccountCategory } from '../type/AccountCategory';
import { Except } from 'type-fest';

export const SelectAccountCategory = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Except<
    React.ComponentPropsWithoutRef<typeof Combobox.Trigger>,
    'onSelect'
  > & {
    selected?: string;
    onSelect: (categoryId: string) => void;
    recordId: string;
  }
>(({ onSelect, selected, recordId, ...props }, ref) => {
  const [selectedCategory, setSelectedCategory] = useState<
    IAccountCategory | undefined
  >();

  const { accountCategories, loading } = useAccountCategories({
    onCompleted: ({
      accountCategories,
    }: {
      accountCategories: IAccountCategory[];
    }) => {
      setSelectedCategory(
        accountCategories?.find((category) => category._id === selected),
      );
    },
  });

  useEffect(() => {
    if (accountCategories && selected) {
      setSelectedCategory(
        accountCategories?.find((category) => category._id === selected),
      );
    }
  }, [selected, accountCategories]);

  return (
    <SelectTree.Provider id="select-account-category">
      <InlineCell
        name="accountCategory"
        recordId={recordId}
        display={() => (
          <SelectAccountCategoryTrigger
            ref={ref}
            {...props}
            selectedCategory={selectedCategory}
            loading={loading}
          />
        )}
        edit={(closeEditMode) => (
          <InlineCellEdit>
            <SelectAccountCommand
              selected={selected}
              onSelect={(categoryId) => {
                onSelect(categoryId);
                setSelectedCategory(
                  accountCategories?.find(
                    (category) => category._id === categoryId,
                  ),
                );
                closeEditMode();
              }}
            />
          </InlineCellEdit>
        )}
      />
    </SelectTree.Provider>
  );
});

export const SelectAccountCommand = ({
  selected,
  onSelect,
  focusOnMount,
}: {
  selected?: string;
  onSelect: (categoryId: string) => void;
  focusOnMount?: boolean;
}) => {
  const { accountCategories, loading, error } = useAccountCategories();
  const selectedCategory = accountCategories?.find(
    (category) => category._id === selected,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && focusOnMount) {
      inputRef.current.focus();
    }
  }, [focusOnMount]);

  return (
    <Command>
      <Command.Input
        variant="secondary"
        placeholder="Filter by category"
        ref={inputRef}
      />
      <Command.Separator />
      <Command.List className="p-1">
        <Combobox.Empty error={error} loading={loading} />
        {accountCategories?.map((category: IAccountCategory) => (
          <SelectAccountCategoryItem
            key={category._id}
            category={category}
            selected={selectedCategory?._id === category._id}
            onSelect={() => onSelect(category._id)}
            hasChildren={
              accountCategories.find(
                (c: IAccountCategory) => c.parentId === category._id,
              ) !== undefined
            }
          />
        ))}
      </Command.List>
    </Command>
  );
};

const SelectAccountCategoryItem = ({
  category,
  selected,
  onSelect,
  hasChildren,
}: {
  category: IAccountCategory;
  selected: boolean;
  onSelect: () => void;
  hasChildren: boolean;
}) => {
  const { name, code, order } = category;

  return (
    <SelectTree.Item
      order={order}
      hasChildren={hasChildren}
      name={name}
      value={code + name}
      onSelect={onSelect}
      selected={false}
    >
      <SelectAccountCategoryBadge category={category} selected={selected} />
    </SelectTree.Item>
  );
};

const SelectAccountCategoryBadge = ({
  category,
  selected,
}: {
  category?: IAccountCategory;
  selected?: boolean;
}) => {
  if (!category) return null;

  const { name, code, accountCount } = category;

  return (
    <>
      <div className="flex items-center gap-2 flex-auto overflow-hidden justify-start">
        <div className="text-muted-foreground">{code}</div>
        <TextOverflowTooltip value={name} className="flex-auto" />
      </div>
      {!selected ? (
        accountCount > 0 && (
          <div className="text-muted-foreground ml-auto">{accountCount}</div>
        )
      ) : (
        <Combobox.Check checked={selected} />
      )}
    </>
  );
};

const SelectAccountCategoryTrigger = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  React.ComponentPropsWithoutRef<typeof Combobox.Trigger> & {
    selectedCategory?: IAccountCategory;
    loading?: boolean;
  }
>(({ selectedCategory, loading, ...props }, ref) => {
  return (
    <InlineCellDisplay asChild>
      <Combobox.Trigger {...props} ref={ref}>
        {selectedCategory ? (
          <SelectAccountCategoryBadge category={selectedCategory} />
        ) : (
          <Combobox.Value placeholder="Select a category" />
        )}
      </Combobox.Trigger>
    </InlineCellDisplay>
  );
});
