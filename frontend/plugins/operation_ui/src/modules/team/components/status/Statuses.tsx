import { STATUS_TYPE_LABELS } from '@/operation/constants/statusConstants';
import { StatusGroup } from '@/team/components/status/StatusGroup';

export const Statuses = () => {
  return (
    <div className="w-full px-4 sm:px-8 lg:px-16">
      <h1 className="text-2xl font-semibold">Task statuses</h1>
      <div className="mt-4 w-full border border-muted-foreground/15 rounded-md">
        {Object.values(STATUS_TYPE_LABELS).map((_label, index) => (
          <StatusGroup key={_label} statusType={index + 1} />
        ))}
      </div>
    </div>
  );
};
