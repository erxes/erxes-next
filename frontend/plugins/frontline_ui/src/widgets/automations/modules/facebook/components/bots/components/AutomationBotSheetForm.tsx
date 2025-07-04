import { zodResolver } from '@hookform/resolvers/zod';
import { IconChevronDown, IconChevronUp, IconPlus } from '@tabler/icons-react';
import {
  Button,
  Collapsible,
  Form,
  Input,
  Label,
  Select,
  Sheet,
  Spinner,
  Switch,
  useQueryState,
} from 'erxes-ui';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FacebookMessageButtonsGenerator } from '~/widgets/automations/modules/facebook/components/action/components/FacebookMessageButtonsGenerator';
import { useFacebookBotForm } from '~/widgets/automations/modules/facebook/components/bots/hooks/useFacebookBotForm';
import {
  facebookBotFormSchema,
  TFacebookBotForm,
} from '~/widgets/automations/modules/facebook/components/bots/states/facebookBotForm';

const AutomationBotForm = ({
  facebookBotId,
}: {
  facebookBotId: string | null;
}) => {
  const {
    facebookMessengerBot,
    isOptionalOpen,
    setOptionalOpen,
    loadingDetail,
    onSaveloading,
    onSave,
  } = useFacebookBotForm(facebookBotId);

  const form = useForm<TFacebookBotForm>({
    resolver: zodResolver(facebookBotFormSchema),
    defaultValues: {
      name: facebookMessengerBot?.name,
      persistentMenus: facebookMessengerBot?.persistentMenus || [
        { _id: nanoid(), text: 'Get Started', type: 'button' },
      ],
      tag: facebookMessengerBot?.tag || 'CONFIRMED_EVENT_UPDATE',
      greetText: facebookMessengerBot?.greetText,
      isEnabledBackBtn: facebookMessengerBot?.isEnabledBackBtn,
      backButtonText: facebookMessengerBot?.backButtonText,
    },
  });

  if (loadingDetail) {
    return <Spinner />;
  }
  return (
    <>
      <Sheet.Header>
        <Sheet.Title>
          {facebookBotId ? 'Edit' : 'Add new'} facebook bot
        </Sheet.Title>
        <Sheet.Close />
      </Sheet.Header>
      <Sheet.Content className="p-2">
        <Form {...form}>
          <div className="flex flex-col gap-4">
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Name</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="persistentMenus"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Persistent Menu</Form.Label>
                  <Form.Control>
                    <FacebookMessageButtonsGenerator
                      buttons={field.value}
                      setButtons={field.onChange}
                      limit={5}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Collapsible open={isOptionalOpen} onOpenChange={setOptionalOpen}>
              <Collapsible.Trigger asChild>
                <Button variant="secondary" className="w-full">
                  <Label className="flex items-center gap-2">
                    {isOptionalOpen ? 'Hide' : 'Show'} Optional configuration{' '}
                    {isOptionalOpen ? <IconChevronUp /> : <IconChevronDown />}
                  </Label>
                </Button>
              </Collapsible.Trigger>
              <Collapsible.Content className="flex flex-col gap-4">
                <Form.Field
                  control={form.control}
                  name="tag"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>Tag</Form.Label>
                      <Form.Control>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <Select.Trigger id="messenger-tag" className="mt-1">
                            <Select.Value placeholder="Select tag" />
                          </Select.Trigger>
                          <Select.Content>
                            <Select.Item value="CONFIRMED_EVENT_UPDATE">
                              Confirmed Event Update
                            </Select.Item>
                            <Select.Item value="POST_PURCHASE_UPDATE">
                              Post-Purchase Update
                            </Select.Item>
                            <Select.Item value="ACCOUNT_UPDATE">
                              Account Update
                            </Select.Item>
                          </Select.Content>
                        </Select>
                      </Form.Control>
                      <span className="text-accent-foreground">
                        Message tags may not be used to send promotional
                        content, including but not limited to deals,purchases
                        offers, coupons, and discounts. Use of tags outside of
                        the approved use cases may result in restrictions on the
                        Page's ability to send messages.
                        <a
                          href="https://developers.facebook.com/docs/messenger-platform/send-messages/message-tags/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-500/70 transition ease-in-out"
                        >
                          Learn more
                        </a>
                      </span>
                      <Form.Message />
                    </Form.Item>
                  )}
                />
                <Form.Field
                  control={form.control}
                  name="greetText"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>Greet Message</Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />
                <Form.Field
                  control={form.control}
                  name="isEnabledBackBtn"
                  render={({ field }) => (
                    <Form.Item className="flex justify-between">
                      <Form.Label>
                        Enable Back Button on Persistence menu
                      </Form.Label>
                      <Form.Control>
                        <Switch
                          className="flex-none"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />
                <Form.Field
                  control={form.control}
                  name="backButtonText"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>Back Button Text</Form.Label>
                      <Form.Control>
                        <Input
                          {...field}
                          disabled={!form.watch('isEnabledBackBtn')}
                        />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />
              </Collapsible.Content>
            </Collapsible>
          </div>
        </Form>
      </Sheet.Content>
      <Sheet.Footer>
        <Button disabled={onSaveloading} onClick={form.handleSubmit(onSave)}>
          {onSaveloading ? <Spinner /> : 'Save'}
        </Button>
      </Sheet.Footer>
    </>
  );
};

export const AutomationBotSheetForm = () => {
  const [facebookBotId, setFacebookBotId] =
    useQueryState<string>('facebookBotId');
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (facebookBotId) {
      setOpen(true);
    }
  }, [facebookBotId]);

  return (
    <div>
      <Sheet
        open={isOpen}
        onOpenChange={(open) => {
          if (isOpen && !open) {
            setFacebookBotId(null);
          }
          setOpen(open);
        }}
      >
        <Sheet.Trigger asChild>
          <Button>
            <IconPlus />
            Add Bot
          </Button>
        </Sheet.Trigger>
        <Sheet.View>
          {isOpen && <AutomationBotForm facebookBotId={facebookBotId} />}
        </Sheet.View>
      </Sheet>
    </div>
  );
};
