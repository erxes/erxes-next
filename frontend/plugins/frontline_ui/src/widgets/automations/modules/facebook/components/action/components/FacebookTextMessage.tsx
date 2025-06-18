import { Form, Textarea } from 'erxes-ui';
import { Control } from 'react-hook-form';
import { FacebookMessageButtonsGenerator } from '~/widgets/automations/modules/facebook/components/action/components/FacebookMessageButtonsGenerator';
import { InputTextCounter } from '~/widgets/automations/modules/facebook/components/action/components/InputTextCounter';
import {
  TBotMessage,
  TMessageActionForm,
} from '~/widgets/automations/modules/facebook/components/action/states/replyMessageActionForm';

export const FacebookTextMessage = ({
  index,
  message,
  control,
}: {
  index: number;
  message: TBotMessage;
  control: Control<TMessageActionForm>;
}) => {
  const limit = (message.buttons || []).length ? 640 : 2000;

  return (
    <div className="flex flex-col gap-2">
      <Form.Field
        control={control}
        name={`messages.${index}.text`}
        render={({ field }) => (
          <Form.Item>
            <Form.Label className="flex flex-row justify-between">
              Text
              <InputTextCounter
                count={field.value?.length || 0}
                limit={limit}
              />
            </Form.Label>
            <Form.Control>
              <Textarea {...field} />
            </Form.Control>
          </Form.Item>
        )}
      />
      <Form.Field
        control={control}
        name={`messages.${index}.buttons`}
        render={({ field }) => (
          <Form.Item>
            <Form.Label className="flex flex-row justify-between">
              Buttons
              <InputTextCounter count={field.value?.length || 0} limit={13} />
            </Form.Label>
            <Form.Control>
              <FacebookMessageButtonsGenerator
                buttons={field.value || []}
                setButtons={field.onChange}
              />
            </Form.Control>
          </Form.Item>
        )}
      />
    </div>
  );
};
