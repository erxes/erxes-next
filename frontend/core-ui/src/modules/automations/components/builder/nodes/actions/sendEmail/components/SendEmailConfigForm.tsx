import { IconCircleDashedCheck, IconX } from '@tabler/icons-react';
import { Badge, Card, Form, Input, Label, RadioGroup, Tabs } from 'erxes-ui';
import {
  IActionProps,
  PlaceHolderInput,
  SelectCustomer,
  SelectMember,
} from 'ui-modules';
import {
  useSendEmailCustomMailField,
  useSendEmailSidebarForm,
} from '../hooks/useSendEmailSidebarForm';

const ConfigRow = ({
  title,
  isDone,
  subContent,
  children,
}: {
  title: string;
  isDone?: boolean;
  subContent?: string;
  children: any;
}) => {
  return (
    <>
      <div className="space-y-1 text-left">
        <div className="flex items-center space-x-2">
          <Label className="text-sm font-medium">{title}</Label>
          {isDone && <IconCircleDashedCheck className="text-success size-4" />}
        </div>
        {subContent && (
          <p className="font-mono text-muted-foreground text-xs">
            {subContent}
          </p>
        )}
      </div>
      <div className="p-2 border-b">{children}</div>
    </>
  );
};

const CustomMailField = ({
  currentActionIndex,
}: {
  currentActionIndex: number;
}) => {
  const { onChange, removeMail, control, config } =
    useSendEmailCustomMailField(currentActionIndex);

  return (
    <Form.Field
      name={`actions.${currentActionIndex}.config.customMails`}
      control={control}
      render={({ field }) => (
        <Form.Item className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(config?.customMails || []).map((customMail: string) => (
              <Badge key={customMail} variant="secondary" className="pr-1">
                {customMail}
                <IconX
                  className="w-3 h-3 ml-1 hover:text-destructive cursor-pointer"
                  onClick={() => removeMail(customMail)}
                />
              </Badge>
            ))}
          </div>
          <Input
            onKeyPress={(e) => onChange(e, field.onChange)}
            placeholder="Enter email address"
            className="w-full"
          />
        </Form.Item>
      )}
    />
  );
};

const SendEmailConfigurationForm = ({
  currentActionIndex,
}: {
  currentActionIndex: number;
}) => {
  const { config, control, contentType } =
    useSendEmailSidebarForm(currentActionIndex);

  return (
    <Card.Content className="space-y-2 max-w-xl pt-6">
      <ConfigRow
        title="Sender"
        subContent="Who is sending email"
        isDone={!!config?.fromUserId}
      >
        <Form.Field
          name={`actions.${currentActionIndex}.config.type`}
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
              <label className="flex space-x-2 items-center">
                <RadioGroup.Item value="default" id="env-sender" />
                <Label htmlFor="env-sender">Use company email</Label>
              </label>
              <label className="flex space-x-2 items-center">
                <RadioGroup.Item value="custom" id="custom-sender" />
                <Label htmlFor="custom-sender">Custom sender email</Label>
              </label>
            </RadioGroup>
          )}
        />
        {config.type === 'custom' && (
          <Form.Field
            name={`actions.${currentActionIndex}.config.fromUserId`}
            control={control}
            render={({ field }) => (
              <Form.Item className="py-4">
                <SelectMember.FormItem
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </Form.Item>
            )}
          />
        )}
      </ConfigRow>

      <ConfigRow
        title="Recipient"
        subContent="Who is recipients"
        isDone={[
          'attributionMails',
          'customMails',
          'customer',
          'teamMember',
        ].some((key) => (config || {})[key])}
      >
        <Tabs defaultValue="dynamic" className="w-full">
          <Tabs.List className="grid w-full grid-cols-2">
            <Tabs.Trigger
              value="dynamic"
              className="flex items-center space-x-2"
            >
              <span>From Target</span>
              {config?.attributionMails && (
                <div className="ml-2 size-1 bg-primary rounded-full" />
              )}
            </Tabs.Trigger>
            <Tabs.Trigger
              value="static"
              className="flex items-center space-x-2"
            >
              <span>Fixed Recipients</span>
              {(config?.customMails ||
                config?.customer ||
                config?.teamMember) && (
                <div className="ml-2 size-1 bg-primary rounded-full" />
              )}
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="dynamic" className="p-4">
            <Form.Field
              name={`actions.${currentActionIndex}.config.attributionMails`}
              control={control}
              render={({ field }) => (
                <Form.Item>
                  <PlaceHolderInput
                    propertyType={contentType || ''}
                    {...field}
                  />
                </Form.Item>
              )}
            />
          </Tabs.Content>

          <Tabs.Content value="static" className="space-y-4 p-4">
            <CustomMailField currentActionIndex={currentActionIndex} />

            <Form.Field
              name={`actions.${currentActionIndex}.config.teamMember`}
              control={control}
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Team members</Form.Label>
                  <SelectMember.FormItem
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </Form.Item>
              )}
            />

            <Form.Field
              name={`actions.${currentActionIndex}.config.customer`}
              control={control}
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Customers</Form.Label>
                  <SelectCustomer.FormItem
                    mode="multiple"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </Form.Item>
              )}
            />
          </Tabs.Content>
        </Tabs>
      </ConfigRow>

      <ConfigRow
        title="Subject"
        subContent="Configure the subject of the email"
        isDone={!!config?.subject}
      >
        <Form.Field
          name={`actions.${currentActionIndex}.config.subject`}
          control={control}
          render={({ field }) => (
            <Form.Item className="py-4">
              <PlaceHolderInput propertyType={contentType || ''} {...field} />
            </Form.Item>
          )}
        />
      </ConfigRow>

      <ConfigRow title="Selected Email Template">
        <div className="p-4 text-center text-muted-foreground">
          Email template selection will be implemented here
        </div>
      </ConfigRow>
    </Card.Content>
  );
};
export const SendEmailConfigForm = ({ currentActionIndex }: IActionProps) => {
  return <SendEmailConfigurationForm currentActionIndex={currentActionIndex} />;
};
