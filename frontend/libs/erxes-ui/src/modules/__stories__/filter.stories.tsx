/* eslint-disable react-hooks/rules-of-hooks */
import { Meta, StoryObj } from '@storybook/react';
import { Filter, useFilterContext } from '../filter';
import { Command } from 'erxes-ui/components/command';
import { Combobox } from 'erxes-ui/components/combobox';
import {
  IconCalendarEventFilled,
  IconLabelFilled,
  IconHash,
  IconCoins,
  IconToggleRightFilled,
} from '@tabler/icons-react';
import { CurrencyCode, CurrencyField } from 'erxes-ui/index';
import { useState } from 'react';

const meta: Meta<typeof Filter> = {
  title: 'Modules/Filter',
  component: Filter,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => {
      return (
        <Filter id="date-filter">
          <div className="p-8">
            <Story />
          </div>
        </Filter>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Filter>;

export const Default: Story = {
  render: () => {
    const [code, setCode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [currency, setCurrency] = useState<CurrencyCode>(CurrencyCode.MNT);
    const [kind, setKind] = useState<string>('');
    const [journal, setJournal] = useState<string>('');
    const [due, setDue] = useState<string>('');
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    return (
      <div className="flex flex-col gap-4">
        <Filter id="filter-storybook">
          <Filter.Popover scope="filter-storybook">
            <Filter.Trigger />
            <Combobox.Content>
              <Filter.View>
                <Command>
                  <Command.Input
                    placeholder="Filter"
                    variant="secondary"
                    className="bg-background"
                  />

                  <Command.List className="p-1">
                    <Filter.Item value="name" inDialog>
                      <IconLabelFilled />
                      Name
                    </Filter.Item>
                    <Filter.Item value="currency">
                      <IconCoins />
                      Currency
                    </Filter.Item>
                    <Filter.Item value="kind">
                      <IconToggleRightFilled />
                      Kind
                    </Filter.Item>
                    <Command.Separator className="my-1" />
                    {/* <Filter.Item value="due">
                      <IconCalendarEventFilled />
                      Due date
                    </Filter.Item> */}
                  </Command.List>
                </Command>
              </Filter.View>
              {/* <Filter.View filterKey="due">
                <Filter.DateView filterKey="due" />
              </Filter.View>
              <Filter.View filterKey="created">
                <Filter.DateView filterKey="created" />
              </Filter.View>
              <Filter.View filterKey="updated">
                <Filter.DateView filterKey="updated" />
              </Filter.View> */}
              <Filter.View filterKey="currency">
                <FilterCurrencyCommand
                  currency={currency}
                  setCurrency={setCurrency}
                />
              </Filter.View>
            </Combobox.Content>
          </Filter.Popover>
          <Filter.Dialog>
            {/* <Filter.View filterKey="name" inDialog>
              <Filter.DialogStringView filterKey="name" />
            </Filter.View> */}
            {/* <Filter.View filterKey="code" inDialog>
              <Filter.DialogStringView filterKey="code" />
            </Filter.View> */}
            {/* <Filter.View filterKey="due" inDialog>
              <Filter.DialogDateView filterKey="due" />
            </Filter.View> */}
          </Filter.Dialog>
          <Filter.Bar>
            {!!code && (
              <Filter.BarItem>
                <Filter.BarName>
                  <IconHash />
                  Code
                </Filter.BarName>
                <Filter.BarButton filterKey="code" inDialog>
                  {code}
                </Filter.BarButton>
                {/* <Filter.BarClose filterKey="code" /> */}
              </Filter.BarItem>
            )}
            {!!name && (
              <Filter.BarItem>
                <Filter.BarName>
                  <IconLabelFilled />
                  Name
                </Filter.BarName>
                <Filter.BarButton filterKey="name" inDialog>
                  {name}
                </Filter.BarButton>
                {/* <Filter.BarClose filterKey="name" /> */}
              </Filter.BarItem>
            )}
            {!!currency && (
              <FilterBarCurrency
                currency={currency}
                setCurrency={setCurrency}
              />
            )}
            {!!due && <FilterBarDue />}
          </Filter.Bar>
        </Filter>
      </div>
    );
  },
};

const FilterCurrencyCommand = ({
  currency,
  setCurrency,
}: {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
}) => {
  const { setOpen } = useFilterContext();
  return (
    <CurrencyField.SelectCurrencyCommand
      value={currency}
      onSelect={(code) => {
        setCurrency(code as CurrencyCode);
        setOpen(false);
      }}
    />
  );
};

const FilterBarCurrency = ({
  currency,
  setCurrency,
}: {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
}) => {
  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconCoins />
        Currency
      </Filter.BarName>
      <CurrencyField.SelectCurrency
        value={currency ?? undefined}
        onChange={(value) => setCurrency(value)}
        variant="ghost"
        className="rounded-none h-7 bg-background"
      />
      {/* <Filter.BarClose filterKey="currency" /> */}
    </Filter.BarItem>
  );
};

const FilterBarDue = () => {
  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconCalendarEventFilled />
        Due date
      </Filter.BarName>
      {/* <Filter.Date filterKey="due" /> */}
      {/* <Filter.BarClose filterKey="due" /> */}
    </Filter.BarItem>
  );
};
