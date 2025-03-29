import {
  IconCalendarEventFilled,
  IconCoins,
  IconHash,
  IconLabelFilled,
  IconLayoutGridAdd,
  IconNotebook,
  IconToggleRightFilled,
} from '@tabler/icons-react';
import {
  Combobox,
  Command,
  Dialog,
  Filter,
  SelectTree,
  useQueryState,
  SelectCurrencyCommand,
  useFilterContext,
  CurrencyCode,
} from 'erxes-ui';
import { SelectAccountCommand } from './SelectAccountCategory';
import { useEffect, useRef } from 'react';
import { Journal } from '../type/Account';
import { AccountsKindCommand } from './AccountsKind';
import { AccountsJournalCommand } from './AccountsJournal';

export const AccountingFilter = () => {
  return (
    <>
      <Filter.Popover>
        <Filter.Trigger />
        <Combobox.Content>
          <Filter.View>
            <Command>
              <Command.Input
                placeholder="Filter"
                variant="secondary"
                className="bg-background"
              />
              <Command.Separator />
              <Command.List className="p-1">
                <Filter.Item value="name" inDialog>
                  <IconLabelFilled />
                  Name
                </Filter.Item>
                <Filter.Item value="code" inDialog>
                  <IconHash />
                  Code
                </Filter.Item>
                <Filter.Item value="category">
                  <IconLayoutGridAdd />
                  Category
                </Filter.Item>
                <Filter.Item value="currency">
                  <IconCoins />
                  Currency
                </Filter.Item>
                <Filter.Item value="kind">
                  <IconToggleRightFilled />
                  Kind
                </Filter.Item>
                <Filter.Item value="journal">
                  <IconNotebook />
                  Journal
                </Filter.Item>
                <Command.Separator className="my-1" />
                <Filter.Item value="due">
                  <IconCalendarEventFilled />
                  Due date
                </Filter.Item>
              </Command.List>
            </Command>
          </Filter.View>
          <AccountingFilterCategory />
          <Filter.View value="due">
            <Filter.DateView value="due" />
          </Filter.View>
          <Filter.View value="created">
            <Filter.DateView value="created" />
          </Filter.View>
          <Filter.View value="updated">
            <Filter.DateView value="updated" />
          </Filter.View>
          <Filter.View value="currency">
            <AccountingFilterCurrency />
          </Filter.View>
          <Filter.View value="kind">
            <AccountingFilterKind />
          </Filter.View>
          <Filter.View value="journal">
            <AccountingFilterJournal />
          </Filter.View>
        </Combobox.Content>
      </Filter.Popover>
      <Filter.Dialog>
        <Dialog.Content>
          <Filter.View value="name" inDialog>
            <Filter.DialogStringView value="name" />
          </Filter.View>
          <Filter.View value="code" inDialog>
            <Filter.DialogStringView value="code" />
          </Filter.View>
        </Dialog.Content>
      </Filter.Dialog>
    </>
  );
};

export const AccountingFilterCategory = () => {
  const [categoryId, setCategoryId] = useQueryState<string>('categoryId');
  const { resetFilterState } = useFilterContext();

  return (
    <SelectTree.Provider id="account-category-filter">
      <Filter.View value="category">
        <SelectAccountCommand
          focusOnMount
          selected={categoryId ?? undefined}
          onSelect={(categoryId) => {
            setCategoryId(categoryId);
            resetFilterState();
          }}
        />
      </Filter.View>
    </SelectTree.Provider>
  );
};

export const AccountingFilterCurrency = () => {
  const [currency, setCurrency] = useQueryState<CurrencyCode>('currency');
  const { resetFilterState } = useFilterContext();
  return (
    <Filter.View value="currency">
      <SelectCurrencyCommand
        focusOnMount
        value={currency ?? undefined}
        onSelect={(code) => {
          setCurrency(code);
          resetFilterState();
        }}
      />
    </Filter.View>
  );
};

export const AccountingFilterKind = () => {
  const [kind, setKind] = useQueryState<string | null>('kind');
  const { resetFilterState } = useFilterContext();

  const handleSelect = (value: string | null) => {
    setKind(value);
    resetFilterState();
  };

  return (
    <AccountsKindCommand focusOnMount selected={kind} onSelect={handleSelect} />
  );
};

export const AccountingFilterJournal = () => {
  const [journal, setJournal] = useQueryState<string | null>('journal');
  const { resetFilterState } = useFilterContext();

  const handleSelect = (value: string | null) => {
    setJournal(value);
    resetFilterState();
  };

  return (
    <AccountsJournalCommand
      focusOnMount
      selected={journal}
      onSelect={handleSelect}
    />
  );
};
