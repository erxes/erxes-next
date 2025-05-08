import { TPhones } from 'erxes-ui/modules/inputs';
import { Badge } from 'erxes-ui/components';
import { IconCircleDashed, IconCircleDashedCheck } from '@tabler/icons-react';

export const PhoneDisplay = ({ phones }: { phones: TPhones }) => {
  return (
    <div className="flex gap-2">
      {phones.map(
        (phone) =>
          phone.phone && (
            <Badge key={phone.phone} variant="secondary">
              {phone.isPrimary &&
                (phone.status === 'verified' ? (
                  <IconCircleDashedCheck className="text-success size-4" />
                ) : (
                  <IconCircleDashed className="text-muted-foreground size-4" />
                ))}
              {phone.phone}
            </Badge>
          ),
      )}
    </div>
  );
};
