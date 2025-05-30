import dayjs from 'dayjs';
import { Button, DatePicker, Sheet, Switch, useQueryState } from 'erxes-ui';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const BranchWorkingHoursSheet = () => {
  const [workingHoursId] = useQueryState('workingHoursId');
  const [searchParams, setSearchParams] = useSearchParams();

  const setOpen = (newId: string | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (newId) {
      newSearchParams.set('workingHoursId', newId);
    } else {
      newSearchParams.delete('workingHoursId');
    }
    setSearchParams(newSearchParams);
  };
  return (
    <Sheet
      open={!!workingHoursId}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setOpen(null);
        }
      }}
    >
      <Sheet.View className="p-0 md:max-w-screen-md">
        <div className="flex flex-col gap-0 size-full">
          <Sheet.Header>
            <Sheet.Title>Setup branch working hours</Sheet.Title>
            <Sheet.Close />
          </Sheet.Header>
          <Sheet.Content className="grow size-full h-auto flex flex-col">
            {[
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ].map((weekDay) => (
              <WeekDay weekDay={weekDay} key={weekDay} />
            ))}
          </Sheet.Content>
          <Sheet.Footer className="flex justify-end items-center gap-3">
            <Button variant={'secondary'}>Cancel</Button>
            <Button>Save</Button>
          </Sheet.Footer>
        </div>
      </Sheet.View>
    </Sheet>
  );
};

const WeekDay = ({ weekDay }: { weekDay: string }) => {
  const [active, setActive] = useState<boolean>(false);
  return (
    <div className="flex items-center gap-3 p-5" id={weekDay}>
      <Switch checked={active} onCheckedChange={setActive} />
      <span className="font-semibold">{weekDay}</span>
      {!active && (
        <span className="font-medium text-sm text-accent-foreground">
          Not working on this day
        </span>
      )}
    </div>
  );
};
