import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Sheet, Textarea } from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { AutomationActionFormProps } from 'ui-modules';
import { Attributes } from 'ui-modules';
import { z } from 'zod';
import { InputTextCounter } from '~/widgets/automations/modules/facebook/components/action/components/InputTextCounter';

const formSchema = z.object({
  text: z.string(),
  attachments: z.any().optional(),
});

type TCommentActionForm = z.infer<typeof formSchema>;

export const CommentActionForm = ({}: AutomationActionFormProps) => {
  const form = useForm<TCommentActionForm>({
    resolver: zodResolver(formSchema),
    // defaultValues: { ...(currentAction?.config || {}) },
  });

  const { control } = form;
  return (
    <div className="!w-2xl p-4">
      <Form {...form}>
        <Form.Field
          control={control}
          name="text"
          render={({ field }) => (
            <Form.Item>
              <Form.Label className="flex flex-row justify-between">
                Text
                <InputTextCounter
                  count={field.value?.length || 0}
                  limit={8000}
                />
              </Form.Label>
              <Attributes
                contentType="frontline:facebook.comments"
                onSelect={(text) => console.log({ text })}
                buttonText="Attributes"
              />
              <Form.Control>
                <Textarea {...field} placeholder="Enter your text" />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
      </Form>
    </div>
  );
};
