import { useEffect, useId, useState } from 'react';

import { parseISO } from 'date-fns';

import {
  CalendarTwoMonths,
  Dialog,
  RadioGroup,
  Tabs,
} from 'erxes-ui/components';
import { Button } from 'erxes-ui/components/button';
import { cn } from 'erxes-ui/lib/utils';
import {
  MONTHS,
  QUARTERS,
} from 'erxes-ui/modules/filter/date-filter/constants/dateTypes';
import { getDateType } from 'erxes-ui/modules/filter/date-filter/utlis/getDateType';
import { getYearsArray } from 'erxes-ui/modules/filter/date-filter/utlis/getYears';

export const DateFilter = ({
  open,
  onOpenChange,
  value,
  onValueChange,
  label,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: string;
  onValueChange?: (value: string) => void;
  label?: string;
}) => {
  const [tabs, setTabs] = useState('day');
  const [loading, setLoading] = useState(true);
  const { getFirstMatch } = getDateType(value || '');

  useEffect(() => {
    if (open) {
      getFirstMatch({
        year: () => setTabs('year'),
        quarter: () => setTabs('quarter'),
        half: () => setTabs('halfYear'),
        month: () => setTabs('month'),
        date: () => setTabs('day'),
      });
      setTimeout(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleCalendarChange = (value: Date | undefined) => {
    if (!value) {
      return;
    }
    onValueChange?.(value.toISOString());
    onOpenChange?.(false);
  };

  const handleRadioGroupChange = (value: string) => {
    onValueChange?.(value);
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-xl p-0">
        <Tabs value={tabs} onValueChange={setTabs}>
          <Dialog.Header className="p-6 space-y-3">
            <Dialog.Title className="text-sm">{label}</Dialog.Title>
            <div>
              <Tabs.List>
                <Tabs.Trigger value="day">Day</Tabs.Trigger>
                <Tabs.Trigger value="month">Month</Tabs.Trigger>
                <Tabs.Trigger value="quarter">Quarter</Tabs.Trigger>
                <Tabs.Trigger value="halfYear">Half Year</Tabs.Trigger>
                <Tabs.Trigger value="year">Year</Tabs.Trigger>
              </Tabs.List>
            </div>
          </Dialog.Header>
          <div className="border-y border-muted py-6 flex justify-center h-[22rem] overflow-auto">
            {!loading && (
              <>
                <Tabs.Content value="day" className="self-center outline-none">
                  <CalendarTwoMonths
                    mode="single"
                    numberOfMonths={2}
                    showOutsideDays
                    fixedWeeks
                    selected={value ? parseISO(value) : undefined}
                    onSelect={handleCalendarChange}
                  />
                </Tabs.Content>
                <Tabs.Content value="month" className="w-full outline-none">
                  <DateFilterRadioGroup
                    items={MONTHS}
                    onValueChange={handleRadioGroupChange}
                    value={value}
                    className="grid grid-cols-2"
                  />
                </Tabs.Content>
                <Tabs.Content value="quarter" className="w-full outline-none">
                  <DateFilterRadioGroup
                    items={QUARTERS}
                    className="flex flex-col"
                    onValueChange={handleRadioGroupChange}
                    value={value}
                  />
                </Tabs.Content>
                <Tabs.Content value="halfYear" className="w-full outline-none">
                  <DateFilterRadioGroup
                    items={['Half 1', 'Half 2']}
                    className="flex flex-col"
                    onValueChange={handleRadioGroupChange}
                    value={value}
                  />
                </Tabs.Content>
                <Tabs.Content value="year" className="w-full outline-none">
                  <DateFilterRadioGroup
                    className="flex flex-col"
                    onValueChange={handleRadioGroupChange}
                    value={value}
                  />
                </Tabs.Content>
              </>
            )}
          </div>
          <Dialog.Footer className="p-6">
            <Button variant="ghost" size="lg">
              Cancel
            </Button>
            <Button size="lg">Apply</Button>
          </Dialog.Footer>
        </Tabs>
      </Dialog.Content>
    </Dialog>
  );
};

const DateFilterRadioGroup = ({
  items,
  className,
  value,
  onValueChange,
}: {
  items?: string[];
  className: string;
  value?: string;
  onValueChange?: (value: string) => void;
}) => {
  const id = useId();
  return (
    <RadioGroup asChild value={value} onValueChange={onValueChange}>
      <fieldset className={cn('gap-6 w-full px-6 pb-6', className)}>
        {getYearsArray(7, 5).map((year) =>
          items ? (
            <div className="flex flex-col gap-3" key={year}>
              <legend className="font-semibold text-[13px] leading-none">
                {year}
              </legend>
              <div
                className={cn(
                  'grid gap-1',
                  items.length === 12 && 'grid-cols-3',
                  items.length === 2 && 'grid-cols-2',
                  items.length === 4 && 'grid-cols-4'
                )}
              >
                {items.map((item) => (
                  <DateFilterRadioGroupItem
                    id={id}
                    value={year + '-' + item}
                    key={item}
                  >
                    {item}
                  </DateFilterRadioGroupItem>
                ))}
              </div>
            </div>
          ) : (
            <DateFilterRadioGroupItem id={id} value={year + '-y'} key={year}>
              {year}
            </DateFilterRadioGroupItem>
          )
        )}
      </fieldset>
    </RadioGroup>
  );
};

const DateFilterRadioGroupItem = ({ id, value, children }) => {
  return (
    <Button
      size="sm"
      variant="secondary"
      className="shadow-none has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-primary has-[[data-state=checked]]:text-primary-foreground has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring/70"
      asChild
    >
      <label id={`${id}-${value}`}>
        <RadioGroup.Item
          value={value}
          id={`${id}-${value}`}
          className="sr-only after:absolute after:inset-0"
        />
        {children}
      </label>
    </Button>
  );
};
