import { Control, useFieldArray } from 'react-hook-form';
import { Button, Form, Input, Select, Upload, ColorPicker } from 'erxes-ui';
import { TmsFormType } from '@/tms/constants/formSchema';
import { IconUpload, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import PaymentIcon, { paymentIconOptions } from './PaymentIcon';
import AddPaymentDialog from './AddPaymentDialog';
import { SelectMember } from 'ui-modules';

export const TourName = ({ control }: { control: Control<TmsFormType> }) => {
  return (
    <Form.Field
      control={control}
      name="name"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>
            Name <span className="text-destructive">*</span>
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
            <ColorPicker
              value={field.value}
              onValueChange={(value: any) => {
                field.onChange(value);
              }}
              className="w-24"
            />
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
              {field.value ? (
                <div className="relative w-full">
                  <div className="flex justify-center items-center w-full min-h-[7rem] p-4 rounded-md border shadow-sm bg-background">
                    <Upload.Preview className="object-contain max-w-full max-h-32" />
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    type="button"
                    className="absolute top-2 right-2 p-0 w-5 h-5 rounded-full opacity-80 transition-opacity hover:opacity-100"
                    onClick={() => {
                      console.log('LogoField - Delete button clicked');
                      console.log(
                        'LogoField - Current value before delete:',
                        field.value,
                      );
                      field.onChange('');
                    }}
                  >
                    <IconX size={12} />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload.Preview className="hidden" />
                  <Upload.Button
                    size="sm"
                    variant="secondary"
                    type="button"
                    className="flex flex-col justify-center items-center w-full h-28 border border-dashed text-muted-foreground"
                  >
                    <IconUpload className="mb-2" />
                    <Button variant="outline" className="text-sm font-medium">
                      Upload logo
                    </Button>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Max size: 15MB, File type: PNG
                    </p>
                  </Upload.Button>
                </>
              )}
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
              {field.value ? (
                <div className="relative w-full">
                  <div className="flex justify-center items-center w-full min-h-[7rem] p-4 rounded-md border shadow-sm bg-background">
                    <Upload.Preview className="object-contain max-w-full max-h-32" />
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    type="button"
                    className="absolute top-2 right-2 p-0 w-5 h-5 rounded-full opacity-80 transition-opacity hover:opacity-100"
                    onClick={() => {
                      field.onChange('');
                    }}
                  >
                    <IconX size={12} />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload.Preview className="hidden" />
                  <Upload.Button
                    size="sm"
                    variant="secondary"
                    type="button"
                    className="flex flex-col justify-center items-center w-full h-28 border border-dashed text-muted-foreground"
                  >
                    <IconUpload className="mb-2" />
                    <Button variant="outline" className="text-sm font-medium">
                      Upload favicon
                    </Button>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Max size: 15MB, File type: PNG
                    </p>
                  </Upload.Button>
                </>
              )}
            </Upload.Root>
          </Form.Control>
        </Form.Item>
      )}
    />
  );
};

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
          <Form.Label>General Managers</Form.Label>
          <Form.Description>
            General manager can be shown on the top of the post also in the list
            view
          </Form.Description>
          <Form.Control>
            <div className="w-full">
              <SelectMember.FormItem
                value={field.value}
                onValueChange={field.onChange}
              />
            </div>
          </Form.Control>
          <Form.Message className="text-destructive" />
        </Form.Item>
      )}
    />
  );
};

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
          <Form.Control>
            <div className="w-full">
              <SelectMember.FormItem
                value={field.value}
                onValueChange={field.onChange}
              />
            </div>
          </Form.Control>
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
          <div className="flex gap-4 justify-between items-end">
            <Form.Control className="flex-1">
              <Select
                value={
                  Array.isArray(field.value)
                    ? field.value[0] || ''
                    : field.value || ''
                }
                onValueChange={field.onChange}
              >
                <Select.Trigger className="placeholder:text-accent-foreground/70">
                  <Select.Value placeholder="Select payments" />
                </Select.Trigger>
                <Select.Content>
                  {TestPayments.map((payment) => (
                    <Select.Item key={payment.value} value={payment.value}>
                      {payment.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </Form.Control>

            <AddPaymentDialog />
          </div>
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
        <Form.Item className="py-3 border-y">
          <Form.Label>Erxes app token</Form.Label>
          <Form.Description>What is erxes app token ?</Form.Description>
          <Form.Control>
            <Input className="w-40 h-8 rounded-md" {...field} />
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
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'otherPayments',
  });

  const handleAddPayment = () => {
    append({ type: '', title: '', icon: '', config: '' });
  };

  return (
    <div className="py-3">
      <div className="flex flex-col gap-2 items-start self-stretch">
        <h2 className="self-stretch text-[#4F46E5] text-sm font-medium leading-tight">
          Other Payments
        </h2>

        <p className="text-[#71717A] font-['Inter'] text-xs font-medium leading-[140%]">
          Type is must latin, some default types: golomtCard, khaanCard, TDBCard
          Хэрэв тухайн төлбөрт ебаримт хэвлэхгүй бол: "skipEbarimt: true",
          Харилцагч сонгосон үед л харагдах бол: "mustCustomer: true", Хэрэв
          хуваах боломжгүй бол: "notSplit: true" Урьдчилж төлсөн төлбөрөөр
          (Татвар тооцсон) бол: "preTax: true
        </p>
      </div>

      <div className="flex gap-2 justify-end items-center p-3 pt-5">
        <Button
          variant="default"
          className="flex gap-2 items-center mb-6"
          onClick={handleAddPayment}
          type="button"
        >
          <IconPlus size={16} />
          Add payment method
        </Button>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex gap-10 justify-between items-end self-stretch px-4 mb-4 w-full"
        >
          <div className="flex flex-col justify-end items-start">
            <Form.Field
              control={control}
              name={`otherPayments.${index}.type`}
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="text-xs text-gray-600">
                    TYPE
                  </Form.Label>
                  <Form.Control>
                    <Input
                      className="px-0 w-full rounded-none border-0 border-b border-gray-200 shadow-none"
                      {...field}
                    />
                  </Form.Control>
                </Form.Item>
              )}
            />
          </div>

          <div className="flex flex-col justify-end items-start">
            <Form.Field
              control={control}
              name={`otherPayments.${index}.title`}
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="text-xs text-gray-600">
                    TITLE
                  </Form.Label>
                  <Form.Control>
                    <Input
                      className="px-0 w-full rounded-none border-0 border-b border-gray-200 shadow-none"
                      {...field}
                    />
                  </Form.Control>
                </Form.Item>
              )}
            />
          </div>

          <div className="flex flex-col items-start">
            <Form.Field
              control={control}
              name={`otherPayments.${index}.icon`}
              render={({ field }) => (
                <Form.Item className="flex flex-col w-full">
                  <Form.Label className="text-xs text-gray-600">
                    ICON
                  </Form.Label>
                  <Select
                    value={field.value || ''}
                    onValueChange={field.onChange}
                  >
                    <Form.Control>
                      <Select.Trigger className="w-full px-0 border-0 border-b border-gray-200 rounded-none shadow-none [&>span]:flex-1 [&>svg]:w-0 [&>svg]:mr-0">
                        <Select.Value placeholder="Select">
                          {field.value && (
                            <div className="flex gap-2 items-center">
                              <PaymentIcon iconType={field.value} size={16} />
                              {
                                paymentIconOptions.find(
                                  (icon) => icon.value === field.value,
                                )?.label
                              }
                            </div>
                          )}
                        </Select.Value>
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {paymentIconOptions.map((icon) => (
                        <Select.Item
                          key={icon.value}
                          className="text-xs"
                          value={icon.value}
                        >
                          <div className="flex gap-2 items-center">
                            <PaymentIcon iconType={icon.value} size={16} />
                            {icon.label}
                          </div>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                </Form.Item>
              )}
            />
          </div>

          <div className="flex flex-col justify-end items-start">
            <Form.Field
              control={control}
              name={`otherPayments.${index}.config`}
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="text-xs text-gray-600">
                    CONFIG
                  </Form.Label>
                  <Form.Control>
                    <Input
                      className="px-0 w-full rounded-none border-0 border-b border-gray-200 shadow-none"
                      {...field}
                    />
                  </Form.Control>
                </Form.Item>
              )}
            />
          </div>

          <Button
            variant="ghost"
            className="px-2 h-8 text-destructive"
            type="button"
            onClick={() => remove(index)}
          >
            <IconTrash size={16} />
          </Button>
        </div>
      ))}
    </div>
  );
};
