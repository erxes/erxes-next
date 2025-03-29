import {
  IconCoins,
  IconHash,
  IconLabelFilled,
  IconLayoutGridAdd,
  IconNotebook,
  IconToggleRightFilled,
  IconX,
} from '@tabler/icons-react';
import {
  Button,
  Currency,
  CurrencyCode,
  Filter,
  SelectCurrency,
  useMultiQueryState,
  useQueryState,
} from 'erxes-ui';
import { SelectAccountCategory } from './SelectAccountCategory';
import { SelectAccountKindCommand } from './AccountsKind';
import { SelectAccountJournalCommand } from './AccountsJournal';

export const AccountsFilterBar = () => {
  const [queries] = useMultiQueryState<{
    code: string;
    name: string;
    categoryId: string;
    currency: string;
    kind: string;
    journal: string;
  }>(['code', 'name', 'categoryId', 'currency', 'kind', 'journal']);

  const isFiltered = Object.values(queries).some((query) => !!query);

  if (!isFiltered) return null;
  const { code, name, categoryId, currency, kind, journal } = queries;

  return (
    <Filter.Bar>
      {!!code && (
        <Filter.BarItem>
          <Filter.BarName>
            <IconHash />
            Code
          </Filter.BarName>
          <Filter.BarButton value="code" inDialog>
            {code}
          </Filter.BarButton>
          <Filter.BarClose />
        </Filter.BarItem>
      )}
      {!!name && (
        <Filter.BarItem>
          <Filter.BarName>
            <IconLabelFilled />
            Name
          </Filter.BarName>
          <Filter.BarButton value="name" inDialog>
            {name}
          </Filter.BarButton>
          <Filter.BarClose />
        </Filter.BarItem>
      )}
      {!!categoryId && <FilterBarCategory />}
      {!!currency && <FilterBarCurrency />}
      {!!kind && <FilterBarKind />}
      {!!journal && <FilterBarJournal />}
    </Filter.Bar>
  );
};

const FilterBarCategory = () => {
  const [categoryId, setCategoryId] = useQueryState<string>('categoryId');

  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconLayoutGridAdd />
        Category
      </Filter.BarName>
      <SelectAccountCategory
        selected={categoryId ?? undefined}
        onSelect={(categoryId) => setCategoryId(categoryId)}
        recordId="categoryId"
        variant="ghost"
        className="rounded-none h-7 bg-background"
      />
      <Filter.BarClose value="categoryId" />
    </Filter.BarItem>
  );
};

const FilterBarCurrency = () => {
  const [currency, setCurrency] = useQueryState<CurrencyCode>('currency');

  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconCoins />
        Currency
      </Filter.BarName>
      <SelectCurrency
        value={currency ?? undefined}
        onChange={(value) => setCurrency(value)}
        variant="ghost"
        className="rounded-none h-7 bg-background"
      />
      <Filter.BarClose value="currency" />
    </Filter.BarItem>
  );
};

const FilterBarKind = () => {
  const [kind, setKind] = useQueryState<string>('kind');

  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconToggleRightFilled />
        Kind
      </Filter.BarName>
      <SelectAccountKindCommand
        selected={kind}
        onSelect={(value) => setKind(value)}
        variant="ghost"
        className="rounded-none h-7 bg-background"
      />
      <Filter.BarClose value="kind" />
    </Filter.BarItem>
  );
};
const FilterBarJournal = () => {
  const [journal, setJournal] = useQueryState<string>('journal');

  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconNotebook />
        Journal
      </Filter.BarName>
      <SelectAccountJournalCommand
        selected={journal}
        onSelect={(value) => setJournal(value)}
        variant="ghost"
        className="rounded-none h-7 bg-background"
      />
      <Filter.BarClose value="journal" />
    </Filter.BarItem>
  );
};
