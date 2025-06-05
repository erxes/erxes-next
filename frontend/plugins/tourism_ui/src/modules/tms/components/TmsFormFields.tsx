import { Control, useFieldArray } from 'react-hook-form';
import { Button, Form, Input, Label, Select, Switch, Upload } from 'erxes-ui';
import { TmsFormType } from '@/tms/constants/formSchema';
import { IconUpload, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

export const TourName = ({ control }: { control: Control<TmsFormType> }) => {
  return (
    <Form.Field
      control={control}
      name="name"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>
            Tour Name <span className="text-destructive">*</span>
          </Form.Label>
          <Form.Control>
            <Input className="h-8 rounded-md" {...field} />
          </Form.Control>
          <Form.Message className="text-destructive" />
        </Form.Item>
      )}
    />
  );
};

export const SelectColor = ({ control }: { control: Control<TmsFormType> }) => {
  return (
    <Form.Field
      control={control}
      name="color"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>
            Main color <span className="text-destructive">*</span>
          </Form.Label>

          <Form.Control>
            <div
              className="relative w-8 h-8 overflow-hidden rounded-full"
              style={{ backgroundColor: field.value || '#4F46E5' }}
            >
              <Input
                type="color"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                {...field}
              />
            </div>
          </Form.Control>
          <Form.Message className="text-destructive" />
        </Form.Item>
      )}
    />
  );
};

export const LogoField = ({ control }: { control: Control<TmsFormType> }) => {
  return (
    <Form.Field
      name="logo"
      control={control}
      render={({ field }) => (
        <Form.Item>
          <Form.Label>LOGO</Form.Label>
          <Form.Description>
            Image can be shown on the top of the post also
          </Form.Description>
          <Form.Control>
            <Upload.Root
              {...field}
              value={field.value || ''}
              onChange={(fileInfo) => {
                if ('url' in fileInfo) {
                  field.onChange(fileInfo.url);
                }
              }}
            >
              <div className="w-full">
                <Upload.Button
                  size="sm"
                  variant="secondary"
                  type="button"
                  className="flex flex-col items-center justify-center w-full border border-dashed h-28 text-muted-foreground"
                >
                  <IconUpload className="mb-2" />

                  <Button variant="outline" className="text-sm font-medium">
                    Upload logo
                  </Button>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Max size: 15MB, File type: PNG
                  </p>
                </Upload.Button>

                {field.value && (
                  <Upload.Preview className="w-full h-full mt-2" />
                )}
              </div>
            </Upload.Root>
          </Form.Control>
        </Form.Item>
      )}
    />
  );
};

export const FavIconField = ({
  control,
}: {
  control: Control<TmsFormType>;
}) => {
  return (
    <Form.Field
      name="favIcon"
      control={control}
      render={({ field }) => (
        <Form.Item>
          <Form.Label>FAV ICON</Form.Label>

          <Form.Description>
            Fav icon can be shown on the top of the post also in
          </Form.Description>
          <Form.Control>
            <Upload.Root
              {...field}
              value={field.value || ''}
              onChange={(fileInfo) => {
                if ('url' in fileInfo) {
                  field.onChange(fileInfo.url);
                }
              }}
            >
              <Upload.Preview className="hidden" />
              <div className="w-full">
                <Upload.Button
                  size="sm"
                  variant="secondary"
                  type="button"
                  className="flex flex-col items-center justify-center w-full border border-dashed h-28 text-muted-foreground"
                >
                  <IconUpload className="mb-2" />

                  <Button variant="outline" className="text-sm font-medium">
                    Upload favicon
                  </Button>

                  <p className="mt-2 text-sm text-gray-400">
                    Max size: 15MB, File type: PNG
                  </p>
                </Upload.Button>

                {field.value && (
                  <Upload.Preview className="w-full h-full mt-2" />
                )}
              </div>
            </Upload.Root>
          </Form.Control>
        </Form.Item>
      )}
    />
  );
};

const TestGeneralManager = [
  { label: 'Bold Bold', value: '1' },
  { label: 'Bat Bat', value: '2' },
  { label: 'Toroo Toroo', value: '3' },
  { label: 'Temuulen Temuulen', value: '4' },
];

export const GeneralManager = ({
  control,
}: {
  control: Control<TmsFormType>;
}) => {
  return (
    <Form.Field
      control={control}
      name="generalManager"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>General Manager</Form.Label>
          <Form.Description>
            General manager can be shown on the top of the post also in the list
            view
          </Form.Description>
          <Select
            onValueChange={(value) => {
              const currentValues = field.value || [];
              if (currentValues.includes(value)) {
                field.onChange(currentValues.filter((v) => v !== value));
              } else {
                field.onChange([...currentValues, value]);
              }
            }}
            value={field.value && field.value.length > 0 ? field.value[0] : ''}
          >
            <Form.Control>
              <Select.Trigger className="justify-between h-8 truncate rounded-md appearance-none w-44 text-foreground [&>span]:flex-1 [&>svg]:w-0 [&>svg]:mr-0">
                <Select.Value
                  placeholder={
                    <span className="text-sm font-medium text-center truncate text-muted-foreground">
                      {'Choose team member'}
                    </span>
                  }
                >
                  <span className="text-sm font-medium text-foreground">
                    {field.value && field.value.length > 0
                      ? TestGeneralManager.find(
                          (status) => status.value === field.value?.[0],
                        )?.label || ''
                      : ''}
                  </span>
                </Select.Value>
              </Select.Trigger>
            </Form.Control>
            <Select.Content
              className="border p-0 [&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2"
              align="start"
            >
              <Select.Group>
                {TestGeneralManager.map((status) => (
                  <Select.Item
                    key={status.value}
                    className="text-xs h-7"
                    value={status.value}
                  >
                    {status.label}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select>
          <Form.Message className="text-destructive" />
        </Form.Item>
      )}
    />
  );
};

const TestManagers = [
  { label: 'Bold Bold', value: '1' },
  { label: 'Bat Bat', value: '2' },
  { label: 'Toroo Toroo', value: '3' },
  { label: 'Temuulen Temuulen', value: '4' },
];

export const Manager = ({ control }: { control: Control<TmsFormType> }) => {
  return (
    <Form.Field
      control={control}
      name="managers"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>Managers</Form.Label>
          <Form.Description>
            Manager can be shown on the top of the post also in the list view
          </Form.Description>
          <Select
            onValueChange={(value) => {
              const currentValues = field.value || [];
              if (currentValues.includes(value)) {
                field.onChange(currentValues.filter((v) => v !== value));
              } else {
                field.onChange([...currentValues, value]);
              }
            }}
            value={field.value && field.value.length > 0 ? field.value[0] : ''}
          >
            <Form.Control>
              <Select.Trigger className="justify-between h-8 truncate rounded-md appearance-none [&>svg]:hidden w-44 text-foreground [&>span]:flex-1 [&>svg]:w-0 [&>svg]:mr-0">
                <Select.Value
                  placeholder={
                    <span className="text-sm font-medium text-center truncate text-muted-foreground">
                      {'Choose team member'}
                    </span>
                  }
                >
                  <span className="text-sm font-medium text-foreground">
                    {field.value && field.value.length > 0
                      ? TestManagers.find(
                          (status) => status.value === field.value?.[0],
                        )?.label || ''
                      : ''}
                  </span>
                </Select.Value>
              </Select.Trigger>
            </Form.Control>
            <Select.Content
              className="border p-0 [&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2"
              align="start"
            >
              <Select.Group>
                {TestManagers.map((status) => (
                  <Select.Item
                    key={status.value}
                    className="text-xs h-7"
                    value={status.value}
                  >
                    {status.label}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select>
          <Form.Message className="text-destructive" />
        </Form.Item>
      )}
    />
  );
};

const TestPayments = [
  { value: '1', label: 'Visa' },
  { value: '2', label: 'Qpay' },
  { value: '3', label: 'Mastercard' },
];

export const Payments = ({ control }: { control: Control<TmsFormType> }) => {
  return (
    <Form.Field
      control={control}
      name="payment"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>PAYMENTS</Form.Label>
          <Form.Description>
            Select payments that you want to use
          </Form.Description>

          <div className="flex items-center justify-between pb-3 my-2 space-x-4">
            <Select
              onValueChange={(value) => {
                const currentValues = field.value || [];
                if (currentValues.includes(value)) {
                  field.onChange(currentValues.filter((v) => v !== value));
                } else {
                  field.onChange([...currentValues, value]);
                }
              }}
              value={
                field.value && field.value.length > 0 ? field.value[0] : ''
              }
            >
              <Form.Control>
                <Select.Trigger className="justify-between w-40 h-8 truncate rounded-md text-foreground appearance-none [&>span]:flex-1 [&>svg]:w-0 [&>svg]:mr-0">
                  <Select.Value
                    placeholder={
                      <span className="text-sm font-medium truncate text-muted-foreground">
                        {'Select payments'}
                      </span>
                    }
                  >
                    <span className="text-sm font-medium text-foreground">
                      {field.value && field.value.length > 0
                        ? TestPayments.find(
                            (status) => status.value === field.value?.[0],
                          )?.label || ''
                        : ''}
                    </span>
                  </Select.Value>
                </Select.Trigger>
              </Form.Control>
              <Select.Content
                className="border p-0 [&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2"
                align="start"
              >
                <Select.Group>
                  {TestPayments.map((status) => (
                    <Select.Item
                      key={status.value}
                      className="text-xs h-7"
                      value={status.value}
                    >
                      {status.label}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select>

            <Button
              variant="default"
              className="flex items-center h-8 gap-2"
              type="button"
              onClick={() => {
                // This would trigger adding a new payment method
                // For now, just show that it's interactive
              }}
            >
              <IconPlus size={18} />
              Add Payment
            </Button>
          </div>

          {field.value && field.value.length > 0 && (
            <div className="pb-2 my-2">
              <div className="mb-1 text-xs text-muted-foreground">
                Selected payments:
              </div>
              <div className="flex flex-wrap gap-1">
                {field.value.map((paymentId) => {
                  const payment = TestPayments.find(
                    (p) => p.value === paymentId,
                  );
                  return payment ? (
                    <span
                      key={paymentId}
                      className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-primary/10 text-primary"
                    >
                      {payment.label}
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange(
                            field.value?.filter((v) => v !== paymentId),
                          );
                        }}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          <Form.Message className="text-destructive" />
        </Form.Item>
      )}
    />
  );
};

export const Token = ({ control }: { control: Control<TmsFormType> }) => {
  return (
    <Form.Field
      control={control}
      name="token"
      render={({ field }) => (
        <Form.Item className="py-3 border-t">
          <Form.Label>Erxes app token</Form.Label>
          <Form.Description>What is erxes app token ?</Form.Description>
          <Form.Control>
            <Input className="w-40 rounded-md h-7" {...field} />
          </Form.Control>
          <Form.Message className="text-destructive" />
        </Form.Item>
      )}
    />
  );
};

export const OtherPayments = ({
  control,
}: {
  control: Control<TmsFormType>;
}) => {
  // Define Icon options
  const Icon = [
    { value: 'visa', label: 'Visa' },
    { value: 'mastercard', label: 'Mastercard' },
    { value: 'qpay', label: 'QPay' },
    { value: 'socialpay', label: 'SocialPay' },
  ];

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'otherPayments',
  });

  const handleAddPayment = () => {
    append({ type: '', title: '', icon: '', config: '' });
  };

  return (
    <div className="py-2">
      <div className="flex flex-col items-start self-stretch gap-2">
        <h2 className="self-stretch text-sm font-medium leading-tight text-primary">
          Other Payments
        </h2>

        <p className="text-xs font-medium leading-[140%] text-muted-foreground">
          Type is must latin, some default types: golomtCard, khaanCard, TDBCard
          Хэрэв тухайн төлбөрт ебаримт хэвлэхгүй бол: "skipEbarimt: true",
          Харилцагч сонгосон үед л харагдах бол: "mustCustomer: true", Хэрэв
          хуваах боломжгүй бол: "notSplit: true" Урьдчилж төлсөн төлбөрөөр
          (Татвар тооцсон) бол: "preTax: true
        </p>
      </div>

      <div className="flex items-center justify-end gap-2 p-3 pt-5">
        <Button
          variant="default"
          className="flex items-center gap-2 mb-6"
          onClick={handleAddPayment}
          type="button"
        >
          <IconPlus size={16} />
          Add payment method
        </Button>
      </div>

      <div className="px-4 max-h-[60px] overflow-y-auto">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-end self-stretch justify-between w-full px-4 mb-4"
          >
            <div className="flex w-[100px] flex-col justify-end items-start">
              <Form.Field
                control={control}
                name={`otherPayments.${index}.type`}
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label className="text-xs">TYPE</Form.Label>
                    <Form.Control>
                      <Input
                        className="w-full px-0 border-0 border-b rounded-none shadow-none"
                        {...field}
                      />
                    </Form.Control>
                  </Form.Item>
                )}
              />
            </div>

            <div className="flex w-[100px] flex-col justify-end items-start">
              <Form.Field
                control={control}
                name={`otherPayments.${index}.title`}
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label className="text-xs">TITLE</Form.Label>
                    <Form.Control>
                      <Input
                        className="w-full px-0 border-0 border-b rounded-none shadow-none"
                        {...field}
                      />
                    </Form.Control>
                  </Form.Item>
                )}
              />
            </div>

            <div className="flex w-[100px] flex-col items-start">
              <Form.Field
                control={control}
                name={`otherPayments.${index}.icon`}
                render={({ field }) => (
                  <Form.Item className="flex flex-col w-full">
                    <Form.Label className="text-xs ">ICON</Form.Label>
                    <Select
                      value={field.value || ''}
                      onValueChange={field.onChange}
                    >
                      <Form.Control>
                        <Select.Trigger className="w-full px-0 border-0 border-b rounded-none shadow-none [&>span]:flex-1 [&>svg]:w-0 [&>svg]:mr-0">
                          <Select.Value placeholder="Select" />
                        </Select.Trigger>
                      </Form.Control>
                      <Select.Content>
                        {Icon.map((icon) => (
                          <Select.Item
                            key={icon.value}
                            className="text-xs"
                            value={icon.value}
                          >
                            {icon.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  </Form.Item>
                )}
              />
            </div>

            <div className="flex w-[100px] flex-col justify-end items-start">
              <Form.Field
                control={control}
                name={`otherPayments.${index}.config`}
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label className="text-xs ">CONFIG</Form.Label>
                    <Form.Control>
                      <Input
                        className="w-full px-0 border-0 border-b rounded-none shadow-none"
                        {...field}
                      />
                    </Form.Control>
                  </Form.Item>
                )}
              />
            </div>

            <Button
              variant="ghost"
              className="h-8 px-2 text-destructive"
              type="button"
              onClick={() => remove(index)}
            >
              <IconTrash size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Prepaid = ({ control }: { control: Control<TmsFormType> }) => {
  const [prepaidSwitch, setPrepaidSwitch] = useState<boolean>(false);

  return (
    <div className="grid grid-cols-2 gap-6 py-3 border-y">
      <div className="flex flex-col gap-3">
        <Label>Enable Prepaid Option</Label>
        <Switch
          checked={prepaidSwitch}
          onCheckedChange={setPrepaidSwitch}
          className="w-10 h-6 [&_span]:size-4 data-[state=checked]:[&_span]:translate-x-[19px] data-[state=checked]:[&_span]:rtl:-translate-x-[19px]"
        />
      </div>

      {prepaidSwitch && (
        <Form.Field
          control={control}
          name="prepaidAmount"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Prepaid Percentage (%)</Form.Label>
              <Form.Control>
                <Input
                  type="number"
                  className="rounded-md h-7"
                  min={1}
                  max={100}
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (isNaN(value)) {
                      field.onChange('');
                    } else if (value < 1) {
                      field.onChange(1);
                    } else if (value > 100) {
                      field.onChange(100);
                    } else {
                      field.onChange(value);
                    }
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              </Form.Control>
            </Form.Item>
          )}
        />
      )}
    </div>
  );
};
