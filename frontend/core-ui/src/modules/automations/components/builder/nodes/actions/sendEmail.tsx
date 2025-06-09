import { getContentType } from '@/automations/utils/automationBuilderUtils';
import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { IconCheck, IconCircleDashedCheck, IconX } from '@tabler/icons-react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Collapsible,
  Form,
  Input,
  Label,
  Separator,
  Tabs,
} from 'erxes-ui';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  AssignMultipleMembers,
  IActionProps,
  PlaceHolderInput,
  SelectCustomers,
} from 'ui-modules';

const ConfigRow = ({
  title,
  isDone,
  subContent,
  buttonText,
  children,
}: {
  title: string;
  isDone?: boolean;
  subContent?: string;
  buttonText: string;
  children: any;
}) => {
  const [isOpen, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(!isOpen);
  };

  return (
    <>
      <Collapsible open={isOpen} className="w-full">
        <Collapsible.Trigger className="flex flex-row gap-4 align-between justify-between w-full">
          <div className="flex flex-row align-between">
            <div className="flex flex-col gap-2 items-start">
              <Label className="flex flex-row gap-2 items-center">
                {title}
                {isDone && (
                  <IconCircleDashedCheck className={'text-success w-4 h-4'} />
                )}
              </Label>
              <span className="font-mono text-muted-foreground text-start text-xs">
                {subContent}
              </span>
            </div>
          </div>
          {isOpen ? (
            <Button variant="link" onClick={toggleOpen}>
              <IconX />
            </Button>
          ) : (
            <Button variant="link" onClick={toggleOpen}>
              {`Edit ${buttonText}`}
            </Button>
          )}
        </Collapsible.Trigger>
        <Collapsible.Content>{children}</Collapsible.Content>
        <Separator className="mt-4" />
      </Collapsible>
    </>
  );
};

const CustomMailField = ({
  currentActionIndex,
}: {
  currentActionIndex: number;
}) => {
  const { control, watch, setValue } = useFormContext<TAutomationProps>();
  const config = watch(`detail.actions.${currentActionIndex}.config`);

  const removeMail = (mail: string) => {
    setValue(
      `detail.actions.${currentActionIndex}.config.customMails`,
      (config?.customMails || []).filter((value: string) => value !== mail),
    );
  };

  const onChange = (e: any, onChange: (...props: any[]) => void) => {
    const { value } = e.currentTarget;
    if (
      e.key === 'Enter' &&
      value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ) {
      onChange((config?.customMails || []).concat(value));
      e.currentTarget.value = '';
    }
  };

  return (
    <Form.Field
      name={`detail.actions.${currentActionIndex}.config.customMails`}
      control={control}
      render={({ field }) => (
        <Form.Item>
          {(config?.customMails || []).map((customMail: string) => (
            <Badge key={customMail}>
              {customMail}
              <IconX
                className="w-4 h-4 hover:text-accent-foreground hover:cursor-pointer"
                onClick={() => removeMail(customMail)}
              />
            </Badge>
          ))}
          <Input
            onKeyPress={(e) => onChange(e, field.onChange)}
            placeholder="Enter some email"
          />
        </Form.Item>
      )}
    />
  );
};

const ConfigurationForm = ({
  currentActionIndex,
}: {
  currentActionIndex: number;
}) => {
  const { control, watch } = useFormContext<TAutomationProps>();
  const config = watch(`detail.actions.${currentActionIndex}.config`);
  const { actions = [], triggers = [] } = watch('detail');
  const contentType = getContentType(
    actions[currentActionIndex],
    actions,
    triggers,
  );

  return (
    <Card.Content className="flex flex-col gap-4 max-w-xl">
      <ConfigRow
        title="Sender"
        subContent="Who is sending email"
        buttonText="sender"
        isDone={!!config?.fromUserId}
      >
        <Form.Field
          name={`detail.actions.${currentActionIndex}.config.fromUserId`}
          control={control}
          render={({ field }) => (
            <Form.Item className="py-4">
              <AssignMultipleMembers
                value={field.value}
                onValueChange={field.onChange}
              />
            </Form.Item>
          )}
        />
      </ConfigRow>

      <ConfigRow
        title="Reciepent"
        buttonText="select recipients"
        subContent="Who is reciepents"
        isDone={[
          'attributionMails',
          'customMails',
          'customer',
          'teamMember',
        ].some((key) => (config || {})[key])}
      >
        <Tabs defaultValue="general" className="w-full p-4">
          <Tabs.List size="sm" className="w-full">
            <Tabs.Trigger value="general" size="sm" className="w-full">
              General
              {config?.attributionMails && (
                <Badge variant="destructive">
                  <IconCheck />
                </Badge>
              )}
            </Tabs.Trigger>
            <Tabs.Trigger value="static" className="relative w-full" size="sm">
              Static
              {(config?.customMails ||
                config?.customer ||
                config?.teamMember) && <IconCheck className="w-4 h-4" />}
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="general" className="p-4">
            <Form.Field
              name={`detail.actions.${currentActionIndex}.config.attributionMails`}
              control={control}
              render={({ field }) => (
                <Form.Item>
                  <PlaceHolderInput propertyType={contentType} {...field} />
                </Form.Item>
              )}
            />
          </Tabs.Content>
          <Tabs.Content value="static" className="p-4">
            <CustomMailField currentActionIndex={currentActionIndex} />
            <Form.Field
              name={`detail.actions.${currentActionIndex}.config.teamMember`}
              control={control}
              render={({ field }) => (
                <Form.Item className="py-4">
                  <Form.Label>Team members</Form.Label>
                  <AssignMultipleMembers
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </Form.Item>
              )}
            />
            <Form.Field
              name={`detail.actions.${currentActionIndex}.config.customer`}
              control={control}
              render={({ field }) => (
                <Form.Item className="py-4">
                  <Form.Label>Customers</Form.Label>
                  <SelectCustomers.FormItem
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
        buttonText="Subject"
        isDone={!!config?.subject}
      >
        <Form.Field
          name={`detail.actions.${currentActionIndex}.config.subject`}
          control={control}
          render={({ field }) => (
            <Form.Item className="py-4">
              <PlaceHolderInput propertyType={contentType} {...field} />
            </Form.Item>
          )}
        />
      </ConfigRow>
      <ConfigRow
        title="Selected Email Template"
        buttonText="Change email template"
      >
        template
      </ConfigRow>
    </Card.Content>
  );
};
export const AutomationSendEmail = ({ currentActionIndex }: IActionProps) => {
  return <ConfigurationForm currentActionIndex={currentActionIndex} />;
};
