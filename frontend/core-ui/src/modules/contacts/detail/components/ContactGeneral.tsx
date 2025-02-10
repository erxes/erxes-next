import {
  IconDeviceMobileMessage,
  IconDotsVertical,
  IconEdit,
  IconMail,
  IconPhone,
} from '@tabler/icons-react';

import { Avatar, Button, Separator, Skeleton } from 'erxes-ui/components';

import { ContactDetailSelectTag } from '@/contacts/detail/components/ContactDetailSelectTag';
import { useContactDetail } from '@/contacts/detail/hooks/useContactDetail';
import { ContactDetailAssignedTo } from './ContactDetailAssignedTo';
import { ITag } from '@/tags/types/tagTypes';

export const ContactGeneral = () => {
  const { customerDetail, loading } = useContactDetail();
  const {
    _id,
    firstName,
    lastName,
    primaryEmail,
    primaryPhone,
    avatar,
    getTags,
    ownerId,
    code,
    score,
  } = customerDetail || {};

  if (loading) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <>
      <div className="py-8 space-y-6">
        <div className="flex gap-3 items-center px-8">
          <Avatar size="lg" className="h-16 w-16">
            <Avatar.Image src={avatar} />
            <Avatar.Fallback colorSeed={_id}>
              {(firstName || lastName || primaryEmail || primaryPhone)?.charAt(
                0,
              )}
            </Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <div className="text-lg font-medium leading-none">
              {firstName} {lastName}
            </div>
            <div className="text-muted-foreground font-medium leading-none">
              {primaryEmail}
            </div>
          </div>
          <div className="flex gap-4 ml-auto">
            <Button variant="outline">
              <IconEdit /> Edit Contact
            </Button>
            <Button variant="outline">
              <IconDotsVertical /> Menu
            </Button>
          </div>
        </div>
        <div className="flex gap-4 px-8">
          <Button variant="outline">
            <IconPhone /> Call
          </Button>
          <Button variant="outline">
            <IconMail /> Write Email
          </Button>
          <Button variant="outline">
            <IconDeviceMobileMessage /> Message
          </Button>
        </div>
        <ContactDetailSelectTag tagIds={getTags?.map((tag: ITag) => tag._id)} />
        <ContactDetailAssignedTo ownerId={ownerId} />
        <Separator />
        <div className="px-8 space-y-6 font-medium">
          <DataListItem label="Code">{code}</DataListItem>
          <DataListItem label="Primary Email">{primaryEmail}</DataListItem>
          <DataListItem label="Primary Phone">{primaryPhone}</DataListItem>
          <DataListItem label="Score">{score}</DataListItem>
        </div>
      </div>
    </>
  );
};

const DataListItem = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex gap-2 leading-4">
      <div className="w-32 text-muted-foreground/70">{label}</div>
      {children ? (
        children
      ) : (
        <div className="text-muted-foreground/50 select-none">{'Empty'}</div>
      )}
    </div>
  );
};
