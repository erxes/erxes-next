import { TimeField, DateInput, Switch, ScrollArea } from 'erxes-ui';
import { EMLayout, EMLayoutPreviousStepButton } from './EMLayout';

export const EMHoursAvailability = () => {
  return (
    <EMLayout
      title="Hours availability"
      actions={<EMLayoutPreviousStepButton />}
    >
      <div className="p-4 pt-0">
        <ScrollArea className="w-full ">
          <div className="flex items-center border-b gap-3 py-3">
            <Switch />
            <div className="font-semibold mr-auto">Monday</div>
            <div className="inline-flex gap-3 items-center text-accent-foreground text-sm">
              <TimeField>
                <DateInput />
              </TimeField>
              <span>to</span>
              <TimeField>
                <DateInput />
              </TimeField>
            </div>
            <div className="inline-flex gap-3 items-center text-accent-foreground text-sm">
              <span>Lunch</span>
              <TimeField>
                <DateInput />
              </TimeField>
              <span>to</span>
              <TimeField>
                <DateInput />
              </TimeField>
            </div>
          </div>
          <ScrollArea.Bar orientation="horizontal" />
        </ScrollArea>
      </div>
    </EMLayout>
  );
};
