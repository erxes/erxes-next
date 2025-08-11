import { IconCaretRightFilled } from '@tabler/icons-react';
import {
  Avatar,
  Button,
  Collapsible,
  Label,
  readImage,
  Spinner,
} from 'erxes-ui';
import { CustomerName } from './CustomerName';
import { useCustomerDetail } from '../hooks';
import { CustomerOwner } from './CustomerOwner';
import { CustomerEmails } from './CustomerEmails';

export const CustomerWidget = ({
  customerId,
  scope,
}: {
  customerId: string;
  scope: string;
}) => {
  const { customerDetail, loading } = useCustomerDetail({
    variables: {
      _id: customerId,
    },
  });

  const {
    avatar,
    firstName,
    lastName,
    middleName,
    ownerId,
    primaryEmail,
    emailValidationStatus,
    emails,
  } = customerDetail || {};

  return (
    <Collapsible className="group/collapsible-menu" defaultOpen>
      <div className="p-4">
        <Collapsible.Trigger asChild>
          <Button
            variant="ghost"
            className="w-full text-accent-foreground justify-start text-left"
            size="sm"
          >
            <IconCaretRightFilled className="transition-transform group-data-[state=open]/collapsible-menu:rotate-90" />
            Overview
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Content className="p-2 pl-8">
          {loading ? (
            <Spinner containerClassName="py-20" />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Avatar size="xl">
                  <Avatar.Image src={readImage(avatar || '')} />
                  <Avatar.Fallback>
                    {firstName?.charAt(0) || lastName?.charAt(0) || '-'}
                  </Avatar.Fallback>
                </Avatar>
                <CustomerName
                  _id={customerId}
                  firstName={firstName || ''}
                  lastName={lastName || ''}
                  middleName={middleName || ''}
                  scope={scope + '.Name'}
                  className="rounded font-medium text-base"
                />
              </div>
              <div className="space-y-2">
                <Label>Owner</Label>
                <CustomerOwner _id={customerId} ownerId={ownerId || ''} />
              </div>
              <div className="space-y-2">
                <Label>Emails</Label>
                <CustomerEmails
                  primaryEmail={primaryEmail || ''}
                  _id={customerId}
                  emailValidationStatus={emailValidationStatus || 'valid'}
                  emails={emails || []}
                />
              </div>
            </div>
          )}
        </Collapsible.Content>
      </div>
    </Collapsible>
  );
};
