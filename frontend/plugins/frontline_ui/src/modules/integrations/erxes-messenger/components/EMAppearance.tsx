import { Button, ColorPicker, Form, Upload } from 'erxes-ui';
import {
  erxesMessengerSetupAppearanceAtom,
  erxesMessengerSetupStepAtom,
} from '@/integrations/erxes-messenger/states/erxesMessengerSetupStates';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { EMAPPEARANCE_SCHEMA } from '@/integrations/erxes-messenger/constants/emAppearanceSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  EMLayout,
  EMLayoutPreviousStepButton,
} from '@/integrations/erxes-messenger/components/EMLayout';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

export const EMAppearance = () => {
  const setAppearance = useSetAtom(erxesMessengerSetupAppearanceAtom);
  const setStep = useSetAtom(erxesMessengerSetupStepAtom);
  const form = useForm<z.infer<typeof EMAPPEARANCE_SCHEMA>>({
    resolver: zodResolver(EMAPPEARANCE_SCHEMA),
  });

  const onSubmit = (data: z.infer<typeof EMAPPEARANCE_SCHEMA>) => {
    setAppearance(data);
    setStep((prev) => prev + 1);
  };

  return (
    <Form {...form}>
      <EMAppearanceEffectComponent form={form} />
      <form
        className="flex-auto flex flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <EMLayout
          title="Appearance"
          actions={
            <>
              <EMLayoutPreviousStepButton />
              <Button type="submit">Next step</Button>
            </>
          }
        >
          <div className="space-y-6 p-4 pt-0">
            <Form.Field
              name="brandColor"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Brand color</Form.Label>
                  <Form.Control>
                    <ColorPicker
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setAppearance((prev) => ({
                          ...prev,
                          brandColor: value,
                        }));
                      }}
                      className="w-24"
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              name="logo"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Logo</Form.Label>
                  <Form.Control>
                    <Upload.Root
                      value={field.value || ''}
                      onChange={(fileInfo) => {
                        if ('url' in fileInfo) {
                          field.onChange(fileInfo.url);
                          setAppearance((prev) => ({
                            ...prev,
                            logo: fileInfo.url,
                          }));
                        }
                      }}
                    >
                      <Upload.Preview />
                    </Upload.Root>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
          </div>
        </EMLayout>
      </form>
    </Form>
  );
};

export const EMAppearanceEffectComponent = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof EMAPPEARANCE_SCHEMA>>;
}) => {
  const appearance = useAtomValue(erxesMessengerSetupAppearanceAtom);

  useEffect(() => {
    form.reset(appearance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
