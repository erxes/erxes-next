import { TEmails } from 'erxes-ui/modules/inputs';
import { Badge } from 'erxes-ui/components';
import { IconCircleDashed, IconCircleDashedCheck } from '@tabler/icons-react';

export const EmailDisplay = ({ emails }: { emails: TEmails }) => {
  return (
    <div className="flex gap-2">
      {emails.map(
        (email) =>
          email.email && (
            <Badge key={email.email} variant="secondary">
              {email.isPrimary &&
                (email.status === 'verified' ? (
                  <IconCircleDashedCheck className="text-success size-4" />
                ) : (
                  <IconCircleDashed className="text-muted-foreground size-4" />
                ))}
              {email.email}
            </Badge>
          ),
      )}
    </div>
  );
};
