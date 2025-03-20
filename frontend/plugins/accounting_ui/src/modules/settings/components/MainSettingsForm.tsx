import {
  Button,
  Checkbox,
  Collapsible,
  CurrencyCode,
  Form,
  Input,
  SelectCurrency,
} from 'erxes-ui';
import { useForm, UseFormReturn, useWatch } from 'react-hook-form';
import {
  mainSettingsSchema,
  TMainSettings,
} from '../constants/mainSettingsSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { SelectAccount } from '@/account/components/SelectAccount';

export const MainSettingsForm = () => {
  const form = useForm<TMainSettings>({
    resolver: zodResolver(mainSettingsSchema),
    defaultValues: {
      mainCurrency: 'MNT',
    },
  });
  const onSubmit = (data: TMainSettings) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-full w-full mx-auto max-w-2xl px-9 py-5 flex flex-col gap-8"
      >
        <h1 className="text-lg font-semibold">Main settings</h1>
        <Collapsible defaultOpen>
          <Collapsible.TriggerButton className="h-8 w-auto text-base">
            <Collapsible.TriggerIcon />
            General settings
          </Collapsible.TriggerButton>

          <Collapsible.Content className="pt-4 grid grid-cols-2 gap-4">
            <Form.Field
              control={form.control}
              name="mainCurrency"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label htmlFor="mainCurrency">MAIN CURRENCY</Form.Label>
                  <SelectCurrency
                    value={field.value as CurrencyCode}
                    onChange={(value) => field.onChange(value)}
                    className="w-full"
                  />
                </Form.Item>
              )}
            />
          </Collapsible.Content>
        </Collapsible>
        <Collapsible defaultOpen>
          <Collapsible.TriggerButton className="h-8 w-auto text-base">
            <Collapsible.TriggerIcon />
            Tax settings
          </Collapsible.TriggerButton>
          <Collapsible.Content className="pt-4 grid grid-cols-2 gap-5">
            <VatFormFields form={form} />
            <CtaxFormFields form={form} />
          </Collapsible.Content>
        </Collapsible>
        <div className="text-right">
          <Button className="justify-self-end flex-none" type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export const VatFormFields = ({
  form,
}: {
  form: UseFormReturn<TMainSettings>;
}) => {
  const { hasVat } = useWatch({ control: form.control });
  return (
    <>
      <Form.Field
        control={form.control}
        name="hasVat"
        render={({ field }) => (
          <Form.Item className="col-span-2 flex items-center gap-2 space-y-0">
            <Form.Control>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </Form.Control>
            <Form.Label variant="peer">Has VAT</Form.Label>
          </Form.Item>
        )}
      />
      {hasVat && (
        <>
          <Form.Field
            control={form.control}
            name="vatAccountPayable"
            render={({ field }) => (
              <Form.Item>
                <Form.Label htmlFor="vatAccountPayable">
                  Vat account payable
                </Form.Label>
                <SelectAccount
                  value={field.value}
                  onChange={field.onChange}
                  journal="tax"
                />
              </Form.Item>
            )}
          />
          <Form.Field
            control={form.control}
            name="vatAccountReceivable"
            render={({ field }) => (
              <Form.Item>
                <Form.Label htmlFor="vatAccountReceivable">
                  Vat account receivable
                </Form.Label>
                <SelectAccount
                  value={field.value}
                  onChange={field.onChange}
                  journal="tax"
                />
              </Form.Item>
            )}
          />
          <Form.Field
            control={form.control}
            name="vatAfterAccountPayable"
            render={({ field }) => (
              <Form.Item>
                <Form.Label htmlFor="vatAfterAccountPayable">
                  Vat after account payable
                </Form.Label>
                <SelectAccount
                  value={field.value}
                  onChange={field.onChange}
                  journal="tax"
                />
              </Form.Item>
            )}
          />
          <Form.Field
            control={form.control}
            name="vatAfterAccountReceivable"
            render={({ field }) => (
              <Form.Item>
                <Form.Label htmlFor="vatAfterAccountReceivable">
                  Vat after account receivable
                </Form.Label>
                <SelectAccount
                  value={field.value}
                  onChange={field.onChange}
                  journal="tax"
                />
              </Form.Item>
            )}
          />
        </>
      )}
    </>
  );
};

export const CtaxFormFields = ({
  form,
}: {
  form: UseFormReturn<TMainSettings>;
}) => {
  const { hasCtax } = useWatch({ control: form.control });
  return (
    <>
      <Form.Field
        control={form.control}
        name="hasCtax"
        render={({ field }) => (
          <Form.Item className="col-span-2 flex items-center gap-2 space-y-0 mt-7">
            <Form.Control>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </Form.Control>
            <Form.Label variant="peer">Has Ctax</Form.Label>
          </Form.Item>
        )}
      />
      {hasCtax && (
        <Form.Field
          control={form.control}
          name="ctaxAccountPayable"
          render={({ field }) => (
            <Form.Item>
              <Form.Label htmlFor="ctaxAccountPayable">
                Ctax account payable
              </Form.Label>
              <SelectAccount
                value={field.value}
                onChange={field.onChange}
                journal="tax"
              />
            </Form.Item>
          )}
        />
      )}
    </>
  );
};
