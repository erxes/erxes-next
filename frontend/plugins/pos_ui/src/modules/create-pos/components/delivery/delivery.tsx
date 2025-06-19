'use client';
import { Label, Select } from 'erxes-ui';
import { SelectMember, SelectProduct } from 'ui-modules';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import {
  deliveryConfigSchema,
  type DeliveryConfigFormValues,
} from '../formSchema';
import { IPosDetail } from '@/pos-detail/types/IPos';

interface DeliveryConfigFormProps {
  form?: UseFormReturn<DeliveryConfigFormValues>;
  onFormSubmit?: (data: DeliveryConfigFormValues) => void;
  posDetail?: IPosDetail;
}

export interface DeliveryConfigFormRef {
  submit: () => Promise<void>;
  getFormData: () => DeliveryConfigFormValues;
}

const DeliveryConfigForm = forwardRef<
  DeliveryConfigFormRef,
  DeliveryConfigFormProps
>(({ form: externalForm, onFormSubmit, posDetail }, ref) => {
  const [selectedWatchedUserId, setSelectedWatchedUserId] =
    useState<string>('');
  const [selectedAssignedUserId, setSelectedAssignedUserId] =
    useState<string>('');

  const internalForm = useForm<DeliveryConfigFormValues>({
    resolver: zodResolver(deliveryConfigSchema),
    defaultValues: {
      board: '',
      pipeline: '',
      stage: '',
      watchedUsers: '',
      assignedUsers: '',
      deliveryProduct: '',
      watchedUserIds: [],
      assignedUserIds: [],
      deliveryConfig: {},
    },
  });

  const form = externalForm || internalForm;
  useEffect(() => {
    if (posDetail?.deliveryConfig) {
      const deliveryConfig = posDetail.deliveryConfig;
      const watchedUserId =
        deliveryConfig.watchedUsers ||
        deliveryConfig.users?.watched?.[0] ||
        deliveryConfig.watchedUserIds?.[0] ||
        '';

      const assignedUserId =
        deliveryConfig.assignedUsers ||
        deliveryConfig.users?.assigned?.[0] ||
        deliveryConfig.assignedUserIds?.[0] ||
        '';

      setSelectedWatchedUserId(watchedUserId);
      setSelectedAssignedUserId(assignedUserId);

      form.reset({
        board: deliveryConfig.stage?.board || deliveryConfig.board || '',
        pipeline:
          deliveryConfig.stage?.pipeline || deliveryConfig.pipeline || '',
        stage: deliveryConfig.stage?.stage || deliveryConfig.stage || '',
        watchedUsers: watchedUserId,
        assignedUsers: assignedUserId,
        deliveryProduct:
          deliveryConfig.product?.deliveryProduct ||
          deliveryConfig.deliveryProduct ||
          '',
        watchedUserIds: watchedUserId ? [watchedUserId] : [],
        assignedUserIds: assignedUserId ? [assignedUserId] : [],
        deliveryConfig: deliveryConfig,
      });
    }
  }, [posDetail, form]);

  useEffect(() => {
    if (onFormSubmit) {
      const subscription = form.watch((values) => {
        if (values) {
          const formData = form.getValues();
          const transformedData = {
            ...formData,
            watchedUserIds: selectedWatchedUserId
              ? [selectedWatchedUserId]
              : [],
            assignedUserIds: selectedAssignedUserId
              ? [selectedAssignedUserId]
              : [],
            deliveryConfig: {
              stage: {
                board: formData.board || '',
                pipeline: formData.pipeline || '',
                stage: formData.stage || '',
              },
              users: {
                watched: selectedWatchedUserId ? [selectedWatchedUserId] : [],
                assigned: selectedAssignedUserId
                  ? [selectedAssignedUserId]
                  : [],
              },
              product: {
                deliveryProduct: formData.deliveryProduct || '',
              },
            },
          };
          onFormSubmit(transformedData);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [form, onFormSubmit, selectedWatchedUserId, selectedAssignedUserId]);

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      console.error('Form validation failed');
      return;
    }

    const formData = form.getValues();
    const transformedData = {
      ...formData,
      watchedUserIds: selectedWatchedUserId ? [selectedWatchedUserId] : [],
      assignedUserIds: selectedAssignedUserId ? [selectedAssignedUserId] : [],
      deliveryConfig: {
        stage: {
          board: formData.board || '',
          pipeline: formData.pipeline || '',
          stage: formData.stage || '',
        },
        users: {
          watched: selectedWatchedUserId ? [selectedWatchedUserId] : [],
          assigned: selectedAssignedUserId ? [selectedAssignedUserId] : [],
        },
        product: {
          deliveryProduct: formData.deliveryProduct || '',
        },
      },
    };

    if (onFormSubmit) {
      onFormSubmit(transformedData);
    }
  };

  const getFormData = () => {
    const formData = form.getValues();
    return {
      ...formData,
      watchedUserIds: selectedWatchedUserId ? [selectedWatchedUserId] : [],
      assignedUserIds: selectedAssignedUserId ? [selectedAssignedUserId] : [],
    };
  };

  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
    getFormData,
  }));

  const handleSelectChange = (
    field: keyof DeliveryConfigFormValues,
    value: string,
  ) => {
    form.setValue(field, value, { shouldValidate: true });
  };

  const handleWatchedUserChange = (value: string | string[]) => {
    const userId = Array.isArray(value) ? value[0] : value;
    const finalUserId = userId || '';

    setSelectedWatchedUserId(finalUserId);
    form.setValue('watchedUsers', finalUserId, { shouldValidate: true });
  };

  const handleAssignedUserChange = (value: string | string[]) => {
    const userId = Array.isArray(value) ? value[0] : value;
    const finalUserId = userId || '';

    setSelectedAssignedUserId(finalUserId);
    form.setValue('assignedUsers', finalUserId, { shouldValidate: true });
  };

  const handleDeliveryProductChange = (value: string) => {
    form.setValue('deliveryProduct', value, { shouldValidate: true });
  };

  return (
    <div className="p-3">
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-indigo-600 text-xl font-medium">STAGE</h2>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-500">BOARD</Label>
              <Select
                value={form.watch('board') || ''}
                onValueChange={(value) => handleSelectChange('board', value)}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Choose board" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="board1">Board 1</Select.Item>
                  <Select.Item value="board2">Board 2</Select.Item>
                  <Select.Item value="board3">Board 3</Select.Item>
                </Select.Content>
              </Select>
              {form.formState.errors.board && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.board.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-500">PIPELINE</Label>
              <Select
                value={form.watch('pipeline') || ''}
                onValueChange={(value) => handleSelectChange('pipeline', value)}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Choose pipeline" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="pipeline1">Pipeline 1</Select.Item>
                  <Select.Item value="pipeline2">Pipeline 2</Select.Item>
                  <Select.Item value="pipeline3">Pipeline 3</Select.Item>
                </Select.Content>
              </Select>
              {form.formState.errors.pipeline && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.pipeline.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-500">STAGE</Label>
              <Select
                value={form.watch('stage') || ''}
                onValueChange={(value) => handleSelectChange('stage', value)}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Choose stage" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="stage1">Stage 1</Select.Item>
                  <Select.Item value="stage2">Stage 2</Select.Item>
                  <Select.Item value="stage3">Stage 3</Select.Item>
                </Select.Content>
              </Select>
              {form.formState.errors.stage && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.stage.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <h2 className="text-indigo-600 text-xl font-medium">DEAL USER</h2>
            <p className="text-[#A1A1AA] text-xs font-semibold">
              USER ASSIGNMENTS
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-500">WATCHED USERS</Label>
              <p className="text-gray-600">Select watched team member</p>
              <div>
                <SelectMember
                  value={selectedWatchedUserId || undefined}
                  onValueChange={handleWatchedUserChange}
                  className="w-full h-10 justify-start border border-gray-300 bg-white hover:bg-gray-50"
                />
                {form.formState.errors.watchedUsers && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.watchedUsers.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-500">ASSIGNED USERS</Label>
              <p className="text-gray-600">Select assigned team member</p>
              <div>
                <SelectMember
                  value={selectedAssignedUserId || undefined}
                  onValueChange={handleAssignedUserChange}
                  className="w-full h-10 justify-start border border-gray-300 bg-white hover:bg-gray-50"
                />
                {form.formState.errors.assignedUsers && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.assignedUsers.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-indigo-600 text-xl font-medium">
            DELIVERY PRODUCT
          </h2>

          <div className="space-y-2">
            <SelectProduct
              value={form.watch('deliveryProduct') || ''}
              onValueChange={handleDeliveryProductChange}
              className="w-full h-10 justify-start border border-gray-300 bg-white hover:bg-gray-50"
            />
            {form.formState.errors.deliveryProduct && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.deliveryProduct.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

DeliveryConfigForm.displayName = 'DeliveryConfigForm';

export default DeliveryConfigForm;
