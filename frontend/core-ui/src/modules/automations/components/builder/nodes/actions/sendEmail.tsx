import { getContentType } from '@/automations/utils/automationBuilderUtils';
import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { IconCheck, IconCircleDashedCheck, IconX } from '@tabler/icons-react';
import {
  Button,
  Card,
  Collapsible,
  Form,
  Input,
  Label,
  Separator,
} from 'erxes-ui';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  AssignMultipleMembers,
  IActionProps,
  PlaceHolderInput,
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
                <IconCircleDashedCheck className={'text-success w-4 h-4'} />
              </Label>
              <span className="font-mono text-muted-foreground text-start text-xs">
                {subContent}
              </span>
            </div>
            {/* {isDone &&  */}
            {/* //   } */}
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

const ConfigurationForm = ({
  currentActionIndex,
}: {
  currentActionIndex: number;
}) => {
  const { control, watch } = useFormContext<TAutomationProps>();
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

      <ConfigRow title="Reciepent" buttonText="select recipients">
        dacxzcz
      </ConfigRow>
      <ConfigRow
        title="Subject"
        subContent="Configure the subject of the email"
        buttonText="Subject"
      >
        <Form.Field
          name={`detail.actions.${currentActionIndex}.config.subject`}
          control={control}
          render={({ field }) => (
            <Form.Item className="py-4">
              {/* <Input {...field} /> */}
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
