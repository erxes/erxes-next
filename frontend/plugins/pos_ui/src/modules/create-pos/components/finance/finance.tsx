'use client';
import { Input, Label, Select, Switch } from 'erxes-ui';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { IPosDetail } from '@/pos-detail/types/IPos';
import { options } from '@/constants';
import { FinanceConfigFormValues } from '~/modules/create-pos/components/formSchema';

interface FinanceConfigFormProps {
  form: UseFormReturn<FinanceConfigFormValues>; 
  posDetail?: IPosDetail;
  isReadOnly?: boolean;
  onSubmit?: (data: FinanceConfigFormValues) => Promise<void>;
}

export default function FinanceConfigForm({
  form,
  posDetail,
  isReadOnly = false,
  onSubmit,
}: FinanceConfigFormProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, watch, handleSubmit, reset } = form;
  const isSyncErkhet = watch('isSyncErkhet');

  useEffect(() => {
    if (posDetail) {
      const financeData: FinanceConfigFormValues = {
        isSyncErkhet: posDetail.erkhetConfig?.isSyncErkhet ?? false,
        checkErkhet: posDetail.erkhetConfig?.checkErkhet ?? false,
        checkInventories: posDetail.isCheckRemainder ?? false,
        userEmail: posDetail.erkhetConfig?.userEmail || '',
        beginBillNumber: posDetail.beginNumber || posDetail.erkhetConfig?.beginNumber || '',
        defaultPay: posDetail.erkhetConfig?.defaultPay || '',
        account: posDetail.erkhetConfig?.account || '',
        location: posDetail.erkhetConfig?.location || '',
        getRemainder: posDetail.erkhetConfig?.getRemainder ?? false,
      };
      
      reset(financeData);
    }
  }, [posDetail, reset]);

  const onFormSubmit = async (data: FinanceConfigFormValues) => {
    console.log('Finance form data being submitted:', data);
    if (onSubmit) {
      try {
        setIsSubmitting(true);
        await onSubmit(data);
      } catch (error) {
        console.error('Finance config form submission failed:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('tab', 'delivery');
      setSearchParams(newParams);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="p-3">
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-indigo-600 text-xl font-medium">MAIN</h2>

          <div className="flex flex-col gap-3">
            <span className="text-gray-600">IS SYNC ERKHET</span>
            <Controller
              name="isSyncErkhet"
              control={control}
              render={({ field }) => (
                <Switch
                  className="scale-150 w-7"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isReadOnly}
                />
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-indigo-600 text-xl font-medium">REMAINDER</h2>

          <div className="flex flex-col gap-3">
            <span className="text-gray-600">CHECK ERKHET</span>
            <Controller
              name="checkErkhet"
              control={control}
              render={({ field }) => (
                <Switch
                  className="scale-150 w-7"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isReadOnly}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-gray-600">CHECK INVENTORIES</span>
            <Controller
              name="checkInventories"
              control={control}
              render={({ field }) => (
                <Switch
                  className="scale-150 w-7"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isReadOnly}
                />
              )}
            />
          </div>
        </div>

        {isSyncErkhet && (
          <div className="space-y-6">
            <h2 className="text-indigo-600 text-xl font-medium">OTHER</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">USER EMAIL</Label>
                <Controller
                  name="userEmail"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="email"
                      {...field}
                      placeholder="Enter email"
                      disabled={isReadOnly}
                      readOnly={isReadOnly}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-500">
                  BEGIN BILL NUMBER
                </Label>
                <Controller
                  name="beginBillNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter bill number"
                      disabled={isReadOnly}
                      readOnly={isReadOnly}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-500">DEFAULTPAY</Label>
                <Controller
                  name="defaultPay"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isReadOnly}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder="Select..." />
                      </Select.Trigger>
                      <Select.Content>
                        {options.map((option) => (
                          <Select.Item key={option.value} value={option.value}>
                            {option.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">ACCOUNT</Label>
                <Controller
                  name="account"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter account"
                      disabled={isReadOnly}
                      readOnly={isReadOnly}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-500">LOCATION</Label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter location"
                      disabled={isReadOnly}
                      readOnly={isReadOnly}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {!isReadOnly && onSubmit && (
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : posDetail ? 'Update' : 'Save'}
          </button>
        </div>
      )}
    </form>
  );
}