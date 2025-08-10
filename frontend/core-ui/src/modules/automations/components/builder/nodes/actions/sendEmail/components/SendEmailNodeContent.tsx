import { MetaFieldLine } from '@/automations/components/builder/nodes/MetaFieldLine';
import { generateSendEmailRecipientMails } from '@/automations/utils/automationBuilderUtils';
import { IconEye } from '@tabler/icons-react';
import { Badge, Button, Label, Popover } from 'erxes-ui';
import { useMemo } from 'react';

export const SendEmailNodeContent = ({ config }: any) => {
  const { fromUserId, subject, templateId } = config || {};

  return (
    <>
      <MetaFieldLine fieldName="From" content={fromUserId} />
      <MetaFieldLine
        fieldName="Reciepents"
        content={
          <Popover>
            <Popover.Trigger asChild>
              <Button variant="ghost">
                See Emails
                <IconEye />
              </Button>
            </Popover.Trigger>
            <Popover.Content>
              <Label>Recipient emails</Label>
              <ReciepentEmails config={config} />
            </Popover.Content>
          </Popover>
        }
      />
      <MetaFieldLine fieldName="Subject" content={subject} />
      <MetaFieldLine fieldName="Template" content={`Under develop`} />
    </>
  );
};
const ReciepentEmails = ({ config }: { config: any }) => {
  const mails = useMemo(
    () => generateSendEmailRecipientMails(config),
    [config],
  );

  return (
    <div>
      {mails.map((mail, index) => (
        <Badge key={index}>{mail}</Badge>
      ))}
    </div>
  );
};
