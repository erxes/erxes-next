import { IconDeviceDesktop, IconMail, IconMailCog } from '@tabler/icons-react';
import { cn, Dialog, Label, Switch, Tooltip, useQueryState } from 'erxes-ui';

export const NotifTypeRow = ({
  title,
  description,
  enabled,
  onCheck,
  titleClassName,
}: {
  title: string;
  description?: string;
  enabled?: { email?: boolean; inApp?: boolean };
  onCheck: (name: 'email' | 'inApp', checked: boolean) => void;
  titleClassName?: string;
}) => {
  return (
    <div className="flex justify-between items-center text-accent-foreground">
      <div className="flex flex-col">
        <Label className={cn(titleClassName)}>{title}</Label>
        <span className="text-accent-foreground text-xs ">{description}</span>
      </div>
      <div className="flex flex-row gap-2">
        <div className="flex gap-2 items-center py-2">
          <IconDeviceDesktop className="size-4" />
          <Switch
            checked={enabled?.inApp}
            onCheckedChange={(checked) => onCheck('inApp', checked)}
          />
        </div>
        <div className="flex gap-2 items-center py-2">
          <NotifTypeEmailTemplateModal />
          <Switch
            checked={enabled?.email}
            onCheckedChange={(checked) => onCheck('email', checked)}
          />
        </div>
      </div>
    </div>
  );
};

const NotifTypeEmailTemplateModal = () => {
  const [isOrgDefault] = useQueryState('isOrgDefault');

  if (!isOrgDefault) {
    return <IconMail className="size-4" />;
  }

  return (
    <Dialog>
      <Tooltip.Provider>
        <Tooltip>
          <Tooltip.Trigger asChild>
            <Dialog.Trigger asChild>
              <IconMailCog className="size-4 text-primary animate-pulse cursor-pointer" />
            </Dialog.Trigger>
          </Tooltip.Trigger>
          <Tooltip.Content>Edit email template</Tooltip.Content>
        </Tooltip>
      </Tooltip.Provider>
      <Dialog.Content>
        <Dialog.Title>Email Notification Type Settings </Dialog.Title>
        <Dialog.Description>
          Manage your email template on this notification type
        </Dialog.Description>
        <p className="text-sm text-muted-foreground">
          We're updating your email notification preferences. This feature will
          be available soon with options to customize when and how you receive
          email alerts.
        </p>
      </Dialog.Content>
    </Dialog>
  );
};
