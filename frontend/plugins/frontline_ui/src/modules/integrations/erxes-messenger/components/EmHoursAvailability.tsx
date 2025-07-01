import { TimeField, DateInput, Switch } from 'erxes-ui';
import { EMLayout, EMLayoutPreviousStepButton } from './EMLayout';

export const EmHoursAvailability = () => {
  return (
    <EMLayout
      title="Hours availability"
      actions={<EMLayoutPreviousStepButton />}
    >
      <div className="p-4 pt-0">
        <div className="flex items-center border-b gap-3 py-3">
          <Switch />
          <div className="font-semibold mr-auto">Monday</div>
          <TimeField>
            <DateInput />
          </TimeField>
        </div>
      </div>
    </EMLayout>
  );
};
