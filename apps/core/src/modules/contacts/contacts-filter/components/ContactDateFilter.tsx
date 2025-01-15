import {
  Button,
  CalendarTwoMonths,
  DropdownMenu,
  Tabs,
} from 'erxes-ui/components';
import { Dialog } from 'erxes-ui/components/dialog';
import { useQueryState } from 'nuqs';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { contactDateFilterOpenAtom } from '@/contacts/contacts-filter/states/contactStates';
import { IconChevronRight } from '@tabler/icons-react';

export const ContactDateFilterDropdown = () => {
  const [filter, setFilter] = useQueryState('date');
  const setOpen = useSetRecoilState(contactDateFilterOpenAtom);
  return (
    <>
      <DropdownMenu.RadioGroup value={filter || ''} onValueChange={setFilter}>
        <DropdownMenu.RadioItem value="today">Today</DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="yesterday">
          Yesterday
        </DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="last7Days">
          Last 7 Days
        </DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="last30Days">
          Last 30 Days
        </DropdownMenu.RadioItem>
      </DropdownMenu.RadioGroup>
      <DropdownMenu.Item
        onClick={() => {
          setTimeout(() => setOpen(true));
        }}
      >
        Custom <IconChevronRight className="ml-auto" />
      </DropdownMenu.Item>
    </>
  );
};

export const ContactDateFilter = () => {
  const [filter] = useQueryState('date');
  const setOpen = useSetRecoilState(contactDateFilterOpenAtom);
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        className="bg-background rounded-none"
      >
        {filter}
      </Button>
    </>
  );
};

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const getYearsArray = (startYearOffset, endYearOffset) => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - startYearOffset;
  const endYear = currentYear + endYearOffset;
  console.log(startYear, endYear);
  const yearsArray: number[] = [];
  for (let year = startYear; year <= endYear; year++) {
    yearsArray.push(year);
  }
  console.log(yearsArray);
  return yearsArray;
};

export const ContactDateFilterDialog = () => {
  const [open, setOpen] = useRecoilState(contactDateFilterOpenAtom);
  console.log(getYearsArray(7, 5));
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Content className="max-w-xl p-0">
        <Tabs defaultValue="day">
          <Dialog.Header className="p-6 space-y-3">
            <Dialog.Title className="text-sm">Date created</Dialog.Title>
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
            <Tabs.Content value="day" className="mt-0 self-center outline-none">
              <CalendarTwoMonths
                mode="single"
                numberOfMonths={2}
                showOutsideDays={true}
                fixedWeeks={true}
              />
            </Tabs.Content>
            <Tabs.Content value="month" className="mt-0 w-full outline-none">
              <div className="grid grid-cols-2 gap-6 w-full px-6 pb-6">
                {getYearsArray(7, 5).map((year) => (
                  <div key={year} className="flex flex-col gap-3">
                    <h6 className="font-semibold text-[13px] leading-none">
                      {year}
                    </h6>
                    <div className="grid grid-cols-3 gap-1">
                      {months.map((month) => (
                        <Button
                          key={month}
                          size="sm"
                          variant="secondary"
                          className="shadow-none"
                        >
                          {month}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Tabs.Content>
            <Tabs.Content value="quarter" className="mt-0 w-full outline-none">
              <div className="flex flex-col gap-6 w-full px-6 pb-6">
                {getYearsArray(7, 5).map((year) => (
                  <div key={year} className="flex flex-col gap-3">
                    <h6 className="font-semibold text-[13px] leading-none">
                      {year}
                    </h6>
                    <div className="grid grid-cols-4 gap-1">
                      {['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'].map(
                        (quarter) => (
                          <Button
                            key={quarter}
                            size="sm"
                            variant="secondary"
                            className="shadow-none"
                          >
                            {quarter}
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Tabs.Content>
            <Tabs.Content value="halfYear" className="mt-0 w-full outline-none">
              <div className="flex flex-col gap-6 w-full px-6 pb-6">
                {getYearsArray(7, 5).map((year) => (
                  <div key={year} className="flex flex-col gap-3">
                    <h6 className="font-semibold text-[13px] leading-none">
                      {year}
                    </h6>
                    <div className="grid grid-cols-2 gap-1">
                      {['Half 1', 'Half 2'].map((half) => (
                        <Button
                          key={half}
                          size="sm"
                          variant="secondary"
                          className="shadow-none"
                        >
                          {half}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Tabs.Content>
            <Tabs.Content value="year" className="mt-0 w-full outline-none">
              <div className="flex flex-col gap-6 w-full px-6 pb-6">
                {getYearsArray(7, 5).map((year) => (
                  <Button
                    key={year}
                    size="sm"
                    variant="secondary"
                    className="shadow-none"
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </Tabs.Content>
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
