import { Button, Collapsible, Label, Textarea } from 'erxes-ui';
import { EMLayout, EMLayoutPreviousStepButton } from './EMLayout';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { EMINTRO_SCHEMA } from '@/integrations/erxes-messenger/constants/emIntroSchema';
import { Form } from 'erxes-ui';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  erxesMessengerSetupIntroAtom,
  erxesMessengerSetupStepAtom,
} from '@/integrations/erxes-messenger/states/erxesMessengerSetupStates';
import { useEffect } from 'react';

export const EMIntro = () => {
  const form = useForm<z.infer<typeof EMINTRO_SCHEMA>>({
    resolver: zodResolver(EMINTRO_SCHEMA),
  });

  const setIntro = useSetAtom(erxesMessengerSetupIntroAtom);
  const setStep = useSetAtom(erxesMessengerSetupStepAtom);

  const onSubmit = (data: z.infer<typeof EMINTRO_SCHEMA>) => {
    setIntro(data);
    setStep((prev) => prev + 1);
  };

  return (
    <Form {...form}>
      <form
        className="flex-auto flex flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <EMIntroEffectComponent form={form} />
        <EMLayout
          title="Intro"
          actions={
            <>
              <EMLayoutPreviousStepButton />
              <Button type="submit">Next step</Button>
            </>
          }
        >
          <div className="p-4 pt-0">
            <Collapsible className="group/collapsible" defaultOpen>
              <Collapsible.TriggerButton>
                <Collapsible.TriggerIcon />
                <Label>Online messaging</Label>
              </Collapsible.TriggerButton>
              <Collapsible.Content className="p-4">
                <Form.Field
                  name="welcomeMessage"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>Welcome message</Form.Label>
                      <Form.Control>
                        <Textarea
                          {...field}
                          placeholder="Enter welcome message"
                        />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />
              </Collapsible.Content>
            </Collapsible>
            <Collapsible className="group/collapsible mt-4" defaultOpen>
              <Collapsible.TriggerButton>
                <Collapsible.TriggerIcon />
                <Label>Offline messaging</Label>
              </Collapsible.TriggerButton>
              <Collapsible.Content className="p-4 space-y-4">
                <Form.Field
                  name="awayMessage"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>Away message</Form.Label>
                      <Form.Control>
                        <Textarea {...field} placeholder="Enter away message" />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />
                <Form.Field
                  name="thankyouMessage"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>Thank you message</Form.Label>
                      <Form.Control>
                        <Textarea
                          {...field}
                          placeholder="Enter thank you message"
                        />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />
              </Collapsible.Content>
            </Collapsible>
          </div>
        </EMLayout>
      </form>
    </Form>
  );
};

const EMIntroEffectComponent = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof EMINTRO_SCHEMA>>;
}) => {
  const intro = useAtomValue(erxesMessengerSetupIntroAtom);

  useEffect(() => {
    form.reset(intro);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
