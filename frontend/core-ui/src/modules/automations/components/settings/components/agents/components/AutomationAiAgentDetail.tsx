import { AI_AGENT_KINDS } from '@/automations/components/settings/components/agents/constants/automationAiAgents';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Form, Input, Tabs, Textarea } from 'erxes-ui';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const aiAgentFormSchema = z.object({
  name: z.string(),
  description: z.string(),
  provider: z.string(),
  prompt: z.string(),
  instructions: z.string(),
  files: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
      type: z.string(),
    }),
  ),
  config: z.any(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TAiAgentForm = z.infer<typeof aiAgentFormSchema>;

export const AutomationAiAgentDetail = ({ kind }: { kind: string }) => {
  const form = useForm<TAiAgentForm>({
    resolver: zodResolver(aiAgentFormSchema),
    defaultValues: {
      provider: kind,
    },
  });

  const { img, label } = AI_AGENT_KINDS.find(({ type }) => type === kind) || {};

  return (
    <div className="h-screen w-full flex flex-col p-4">
      <Card className="p-3 flex flex-col gap-2 rounded-lg w-48">
        <div className="flex gap-2 mb-2 items-center">
          <div className="size-8 rounded overflow-hidden shadow-sm bg-background">
            <img
              src={img}
              alt={kind}
              className="w-full h-full object-contain p-1"
            />
          </div>
          <h6 className="font-semibold text-sm self-center">{label}</h6>
        </div>
      </Card>
      <FormProvider {...form}>
        <Tabs defaultValue="general" className="">
          <Tabs.List>
            <Tabs.Trigger className="w-1/2" value="general">
              General
            </Tabs.Trigger>
            <Tabs.Trigger className="w-1/2" value="train">
              Training
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="general" className="w-">
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Name</Form.Label>
                  <Form.Control>
                    <Input
                      type="text"
                      placeholder="Enter your ai agent name"
                      {...field}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="description"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>description</Form.Label>
                  <Form.Control>
                    <Textarea
                      placeholder="Enter your ai agent description"
                      {...field}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>prompt</Form.Label>
                  <Form.Control>
                    <Textarea
                      placeholder="Enter your ai agent prompt"
                      {...field}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>instructions</Form.Label>
                  <Form.Control>
                    <Textarea
                      placeholder="Enter your ai agent instructions"
                      {...field}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
          </Tabs.Content>
          <Tabs.Content value="train"></Tabs.Content>
        </Tabs>
        <div className="flex justify-end pt-4">
          <Button>Save</Button>
        </div>
      </FormProvider>
    </div>
  );
};
