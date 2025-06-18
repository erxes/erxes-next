import { Form, Textarea } from 'erxes-ui';
import { Control } from 'react-hook-form';
import { FacebookMessageButtonsGenerator } from '~/widgets/automations/modules/facebook/components/action/components/FacebookMessageButtonsGenerator';
import { InputTextCounter } from '~/widgets/automations/modules/facebook/components/action/components/InputTextCounter';
import {
  TBotMessage,
  TMessageActionForm,
} from '~/widgets/automations/modules/facebook/components/action/states/replyMessageActionForm';

export const FacebookQuickRepliesMessage = ({
  index,
  control,
}: {
  index: number;
  message: TBotMessage;
  control: Control<TMessageActionForm>;
}) => {
  return (
    <>
      <Form.Field
        control={control}
        name={`messages.${index}.text`}
        render={({ field }) => {
          return (
            <Form.Item>
              <InputTextCounter count={field.value?.length || 0} limit={640} />

              <Textarea {...field} />
            </Form.Item>
          );
        }}
      />
      <Form.Field
        control={control}
        name={`messages.${index}.quickReplies`}
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Label className="flex flex-row justify-between">
                Quick replies
                <InputTextCounter count={field.value?.length || 0} limit={13} />
              </Form.Label>
              <Form.Control>
                <FacebookMessageButtonsGenerator
                  buttons={field.value || []}
                  setButtons={field.onChange}
                  addButtonText="+ add quick reply"
                />
              </Form.Control>
            </Form.Item>
          );
        }}
      />
    </>
  );
};
