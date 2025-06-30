import { Button, ColorPicker, Form, Label, Upload } from 'erxes-ui';
import { useAtom } from 'jotai';
import {
  erxesMessengerSetupAppearanceAtom,
  erxesMessengerSetupStepAtom,
} from '@/integrations/erxes-messenger/states/erxesMessengerSetupStates';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { EMAPEARANCE_SCHEMA } from '@/integrations/erxes-messenger/constants/emAppearanceSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  EMLayout,
  EMLayoutPreviousStepButton,
} from '@/integrations/erxes-messenger/components/EMLayout';

export const EMAppearance = () => {
  const [appearance, setAppearance] = useAtom(
    erxesMessengerSetupAppearanceAtom,
  );
  const [step, setStep] = useAtom(erxesMessengerSetupStepAtom);
  const form = useForm<z.infer<typeof EMAPEARANCE_SCHEMA>>({
    defaultValues: {
      brandColor: appearance?.brandColor,
      logo: appearance?.logo,
    },
    resolver: zodResolver(EMAPEARANCE_SCHEMA),
  });

  const onSubmit = (data: z.infer<typeof EMAPEARANCE_SCHEMA>) => {
    setAppearance(data);
    setStep(step + 1);
  };

  return (
    <Form {...form}>
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
