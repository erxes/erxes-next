import { useAiAgentDetail } from '@/automations/components/settings/components/agents/hooks/useAiAgentDetail';
import { useAiAgents } from '@/automations/components/settings/components/agents/hooks/useAiAgents';
import { IconTrash } from '@tabler/icons-react';
import { Button, Form, Input, Select, Textarea } from 'erxes-ui';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { generateAutomationElementId } from 'ui-modules';
import { z } from 'zod';

const aiAgentSchema = z.object({
  aiAgentId: z.string(),
  topics: z.array(
    z.object({
      id: z.string(),
      topicName: z.string(),
      prompt: z.string(),
    }),
  ),
});

type TAIAgent = z.infer<typeof aiAgentSchema>;

export const AIAgentConfigForm = () => {
  const form = useForm<TAIAgent>({
    defaultValues: {},
  });
  const { control } = form;

  const { automationsAiAgents } = useAiAgents();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'topics',
  });

  return (
    <div className="flex flex-col gap-2 p-4">
      <Form {...form}>
        <Form.Field
          control={control}
          name="aiAgentId"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label>Ai Agent</Form.Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <Select.Trigger className="mt-1">
                    <Select.Value placeholder="Select ai agent" />
                  </Select.Trigger>
                  <Select.Content>
                    {automationsAiAgents.map(({ _id, name }) => (
                      <Select.Item value={_id}>{name}</Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </Form.Item>
            );
          }}
        />

        <div className="flex flex-col gap-2 p-4">
          {fields.map((field, index) => (
            <div key={field.id} className="mb-1 flex flex-col gap-2">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="ml-auto"
                onClick={() => remove(index)}
              >
                <IconTrash />
              </Button>
              <Controller
                name={`topics.${index}.topicName`}
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter topic name" />
                )}
              />
              <Controller
                name={`topics.${index}.prompt`}
                control={control}
                render={({ field }) => (
                  <Textarea {...field} placeholder="Enter prompt of topic" />
                )}
              />
            </div>
          ))}
        </div>

        <Button
          type="button"
          onClick={() =>
            append({
              id: generateAutomationElementId(),
              topicName: `Topic ${fields.length + 1}`,
              prompt: '',
            })
          }
        >
          Add Topic
        </Button>
      </Form>
    </div>
  );
};
