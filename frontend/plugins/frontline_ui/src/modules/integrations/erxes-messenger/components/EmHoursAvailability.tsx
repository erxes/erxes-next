import {
  TimeField,
  DateInput,
  Switch,
  ScrollArea,
  Form,
  RadioGroup,
  Button,
} from 'erxes-ui';
import { EMLayout, EMLayoutPreviousStepButton } from './EMLayout';
import { useForm, UseFormReturn, useWatch, FieldErrors } from 'react-hook-form';
import { Weekday } from '@/integrations/erxes-messenger/types/Weekday';
import { z } from 'zod';
import { EMHOURS_SCHEMA } from '@/integrations/erxes-messenger/constants/emHoursSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseTime } from '@internationalized/date';

export const EMHoursAvailability = () => {
  const form = useForm<z.infer<typeof EMHOURS_SCHEMA>>({
    resolver: zodResolver(EMHOURS_SCHEMA),
    defaultValues: {
      availabilitySwitchType: 'manual',
    },
  });

  const onSubmit = (data: z.infer<typeof EMHOURS_SCHEMA>) => {
    console.log(data);
  };

  const onInvalid = (errors: FieldErrors<z.infer<typeof EMHOURS_SCHEMA>>) => {
    console.log(errors);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="flex-auto flex flex-col"
      >
        <EMLayout
          title="Hours availability"
          actions={
            <>
              <EMLayoutPreviousStepButton />
              <Button type="submit">Next step</Button>
            </>
          }
        >
          <div className="p-4 pt-0">
            <Form.Field
              name="availabilitySwitchType"
              render={({ field }) => (
                <Form.Item className="px-1 pb-4">
                  <Form.Label className="sr-only">
                    Availability switch type
                  </Form.Label>
                  <Form.Control>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col !mt-0"
                    >
                      <Form.Item className="flex items-center gap-3 space-y-0">
                        <Form.Control>
                          <RadioGroup.Item value="manual" />
                        </Form.Control>
                        <Form.Label variant="peer">
                          Turn online/offline manually
                        </Form.Label>
                      </Form.Item>
                      <Form.Item className="flex items-center gap-3 space-y-0">
                        <Form.Control>
                          <RadioGroup.Item value="schedule" />
                        </Form.Control>
                        <Form.Label variant="peer">
                          Set to follow your schedule
                        </Form.Label>
                      </Form.Item>
                    </RadioGroup>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <EMHoursTimeTable form={form} />
          </div>
        </EMLayout>
      </form>
    </Form>
  );
};

export const EMHoursTimeTable = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof EMHOURS_SCHEMA>>;
}) => {
  const availabilitySwitchType = useWatch({
    control: form.control,
    name: 'availabilitySwitchType',
  });

  if (availabilitySwitchType === 'manual') {
    return null;
  }

  return (
    <ScrollArea className="w-full ">
      {Object.values(Weekday).map((day, index) => (
        <Form.Field
          name={`onlineHours.${day}.work`}
          key={index}
          render={({ field }) => (
            <Form.Item className="flex items-center border-b gap-3 py-3 px-1 space-y-0">
              <Form.Control>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </Form.Control>
              <Form.Label
                className="font-semibold mr-auto capitalize leading-7"
                variant="peer"
              >
                {day}
              </Form.Label>

              {field.value && (
                <div className="inline-flex gap-3 items-center text-accent-foreground text-sm">
                  <Form.Field
                    name={`onlineHours.${day}.from`}
                    render={({ field }) => (
                      <Form.Item>
                        <TimeField
                          value={field.value ? parseTime(field.value) : null}
                          onChange={(value) => {
                            field.onChange(value?.toString());
                          }}
                          aria-label={day + ' from'}
                        >
                          <Form.Control>
                            <DateInput />
                          </Form.Control>
                        </TimeField>
                        <Form.Message />
                      </Form.Item>
                    )}
                  />
                  <span>to</span>
                  <Form.Field
                    name={`onlineHours.${day}.to`}
                    render={({ field }) => (
                      <Form.Item>
                        <TimeField
                          value={field.value}
                          onChange={field.onChange}
                          aria-label={day + ' to'}
                        >
                          <Form.Control>
                            <DateInput />
                          </Form.Control>
                        </TimeField>
                        <Form.Message />
                      </Form.Item>
                    )}
                  />
                </div>
              )}
            </Form.Item>
          )}
        />
      ))}
      <ScrollArea.Bar orientation="horizontal" />
    </ScrollArea>
  );
};
