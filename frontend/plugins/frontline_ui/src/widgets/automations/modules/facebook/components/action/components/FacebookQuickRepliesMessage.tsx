import { Form, Textarea } from 'erxes-ui';
import { FacebookMessageProps } from '../types/messageActionForm';
import { FacebookMessageButtonsGenerator } from './FacebookMessageButtonsGenerator';
import { InputTextCounter } from './InputTextCounter';

export const FacebookQuickRepliesMessage = ({
  index,
  control,
}: FacebookMessageProps) => {
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
                  limit={13}
                  buttons={field.value || []}
                  setButtons={field.onChange}
                  addButtonText="+ add quick reply"
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          );
        }}
      />
    </>
  );
};
