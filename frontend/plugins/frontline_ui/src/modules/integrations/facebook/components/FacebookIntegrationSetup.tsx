import { Button, Form, Input } from 'erxes-ui';
import {
  FacebookMessegerAddSteps,
  FacebookMessengerAddLayout,
} from './FacebookMessengerAdd';
import { useSetAtom } from 'jotai';
import { activeFacebookMessengerAddStepAtom } from '../states/facebookStates';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FACEBOOK_MESSENGER_SCHEMA } from '../contants/FbMessengerSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectBrand } from 'ui-modules';
import { SelectChannel } from '@/inbox/channel/components/SelectChannel';

export const FacebookIntegrationSetup = () => {
  const form = useForm<z.infer<typeof FACEBOOK_MESSENGER_SCHEMA>>({
    resolver: zodResolver(FACEBOOK_MESSENGER_SCHEMA),
    defaultValues: {
      name: '',
      brandId: '',
      channelId: '',
    },
  });

  const setActiveStep = useSetAtom(activeFacebookMessengerAddStepAtom);

  const onNext = () => {
    console.log('onNext');
  };

  return (
    <Form {...form}>
      <form className="flex flex-col flex-1">
        <FacebookMessengerAddLayout
          actions={
            <>
              <Button
                variant="secondary"
                className="bg-border"
                onClick={() => setActiveStep(2)}
              >
                Previous step
              </Button>
              <Button onClick={onNext} type="submit">
                Save
              </Button>
            </>
          }
        >
          <FacebookMessegerAddSteps
            title="Integration Setup"
            step={3}
            description=""
          />
          <div className="flex-1 overflow-hidden p-4 pt-0 flex flex-col gap-4">
            <Form.Field
              name="name"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Integration name</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.Description>
                    Name this integration to differentiate from the rest
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              name="brandId"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Brand</Form.Label>
                  <Form.Control>
                    <SelectBrand
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </Form.Control>
                  <Form.Description>
                    Which specific Brand does this integration belong to?
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              name="channelId"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Channel</Form.Label>
                  <Form.Control>
                    <SelectChannel
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </Form.Control>
                  <Form.Description>
                    Which specific Channel does this integration belong to?
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              )}
            />
          </div>
        </FacebookMessengerAddLayout>
      </form>
    </Form>
  );
};
