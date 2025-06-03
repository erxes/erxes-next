import { Button, Form, Input } from 'erxes-ui';
import {
  FacebookMessegerAddSteps,
  FacebookMessengerAddLayout,
} from './FacebookMessengerAdd';
import { useSetAtom } from 'jotai';
import {
  activeFacebookMessengerAddStepAtom,
  selectedFacebookPageAtom,
} from '../states/facebookStates';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FACEBOOK_MESSENGER_SCHEMA } from '../contants/FbMessengerSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectBrand } from 'ui-modules';
import { SelectChannel } from '@/inbox/channel/components/SelectChannel';
import { useIntegrationAdd } from '@/integrations/hooks/useIntegrationAdd';
import { useAtomValue } from 'jotai';
import { selectedFacebookAccountAtom } from '../states/facebookStates';

export const FacebookIntegrationSetup = () => {
  const form = useForm<z.infer<typeof FACEBOOK_MESSENGER_SCHEMA>>({
    resolver: zodResolver(FACEBOOK_MESSENGER_SCHEMA),
    defaultValues: {
      name: '',
      brandId: '',
      channelId: '',
    },
  });

  const accountId = useAtomValue(selectedFacebookAccountAtom);
  const pageId = useAtomValue(selectedFacebookPageAtom);

  const { addIntegration, loading } = useIntegrationAdd();

  const setActiveStep = useSetAtom(activeFacebookMessengerAddStepAtom);

  // {
  //   "name": "fff",
  //   "brandId": "jgJSxH_1Jn5jD2-S393Mf",
  //   "kind": "facebook-messenger",
  //   "accountId": "6mtRo9sP3i2n4forn",
  //   "channelIds": [
  //     "djK6ZOKDjTsku8oYqZuJ8"
  //   ],
  //   "data": {
  //     "pageIds": []
  //   }
  // }

  const onNext = (data: z.infer<typeof FACEBOOK_MESSENGER_SCHEMA>) => {
    addIntegration({
      variables: {
        kind: 'facebook_messenger',
        name: data.name,
        brandId: data.brandId,
        accountId,
        channelIds: data.channelId,
        data: {
          pageIds: [pageId],
        },
      },
    });
    setActiveStep(4);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col flex-1"
        onSubmit={form.handleSubmit(onNext)}
      >
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
              <Button type="submit" disabled={loading}>
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
                  <SelectChannel.FormItem
                    className="flex w-full"
                    value={field.value}
                    onValueChange={field.onChange}
                    mode="single"
                  />
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
