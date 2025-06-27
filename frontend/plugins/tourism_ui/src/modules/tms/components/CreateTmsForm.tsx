import { TmsCreateSheetHeader } from '@/tms/components/CreateTmsSheet';

import { Sheet, Form, useToast } from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { TmsFormSchema, TmsFormType } from '@/tms/constants/formSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApolloError } from '@apollo/client';
import { TmsInformationFields } from '@/tms/components/TmsInformationFields';
import Preview from '@/tms/components/Preview';
import { useCreateBranch } from '../hooks/CreateBranch';
import { useBranchEdit } from '../hooks/BranchEdit';
import { useBranchDetail } from '../hooks/BranchDetail';
import { useEffect } from 'react';

const CreateTmsForm = ({
  branchId,
  onOpenChange,
  onSuccess,
  refetch,
}: {
  branchId?: string;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  refetch?: () => Promise<any>;
}) => {
  const { createBranch } = useCreateBranch();
  const { editBranch } = useBranchEdit();
  const { branchDetail, loading: detailLoading } = useBranchDetail({
    id: branchId || '',
  });

  const isEditMode = !!branchId;

  const form = useForm<TmsFormType>({
    resolver: zodResolver(TmsFormSchema),
    defaultValues: {
      name: '',
      color: '#4F46E5',
      logo: '',
      favIcon: '',
      generalManager: [],
      managers: [],
      payment: '',
      token: '',
      otherPayments: [],
    },
  });

  const watchedValues = form.watch();
  const { toast } = useToast();

  useEffect(() => {
    if (isEditMode && branchDetail) {
      form.reset({
        name: branchDetail.name || '',
        color: branchDetail.uiOptions?.colors?.primary || '#4F46E5',
        logo: branchDetail.uiOptions?.logo || '',
        favIcon: branchDetail.uiOptions?.favIcon || '',
        generalManager: branchDetail.generalManagerIds || [],
        managers: branchDetail.managerIds || [],
        payment: Array.isArray(branchDetail.paymentIds)
          ? branchDetail.paymentIds[0] || ''
          : '',
        token: branchDetail.erxesAppToken || '',
        otherPayments: Array.isArray(branchDetail.permissionConfig)
          ? branchDetail.permissionConfig.map((config: any) => ({
              type: config.type || '',
              title: config.title || '',
              icon: config.icon || '',
              config: config.config || '',
            }))
          : [],
      });
    }
  }, [isEditMode, branchDetail, form]);

  const onSubmit = (data: TmsFormType) => {
    const permissionConfig =
      data.otherPayments?.map((payment) => ({
        type: payment.type,
        title: payment.title,
        icon: payment.icon,
        config: payment.config,
      })) || [];

    const variables = {
      name: data.name,
      generalManagerIds: data.generalManager || [],
      managerIds: data.managers || [],
      paymentIds: data.payment ? [data.payment] : [],
      permissionConfig,
      erxesAppToken: data.token,
      uiOptions: {
        logo: data.logo || '',
        favIcon: data.favIcon || '',
        colors: {
          primary: data.color,
        },
      },
    };

    if (isEditMode) {
      editBranch({
        variables: {
          id: branchId,
          ...variables,
        },
        onError: (e: ApolloError) => {
          toast({
            title: 'Error',
            description: e.message,
            variant: 'destructive',
          });
        },
        onCompleted: () => {
          toast({
            title: 'Success',
            description: 'Branch updated successfully',
          });
          onOpenChange?.(false);
          onSuccess?.();
        },
      });
    } else {
      createBranch({
        variables,
        onError: (e: ApolloError) => {
          toast({
            title: 'Error',
            description: e.message,
            variant: 'destructive',
          });
        },
        onCompleted: async () => {
          toast({
            title: 'Success',
            description: 'Branch created successfully',
          });
          form.reset();
          onOpenChange?.(false);
          onSuccess?.();
          if (refetch) {
            try {
              await refetch();
            } catch (error) {
              toast({
                title: 'Warning',
                description: error as string,
                variant: 'destructive',
              });
            }
          }
        },
      });
    }
  };

  if (isEditMode && detailLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-sm text-muted-foreground">
          Loading branch details...
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        {isEditMode ? (
          <Sheet.Header className="p-5 border">
            <Sheet.Title>Edit Tour Management System</Sheet.Title>
            <Sheet.Close />
          </Sheet.Header>
        ) : (
          <TmsCreateSheetHeader />
        )}
        <Sheet.Content className="grid overflow-y-auto min-h-0 lg:grid-cols-2">
          <div>
            <TmsInformationFields
              form={form}
              onOpenChange={onOpenChange}
              onSubmit={onSubmit}
            />
          </div>
          <div className="hidden lg:block">
            <Preview formData={watchedValues} />
          </div>
        </Sheet.Content>

        <div className="block lg:hidden">
          <Preview formData={watchedValues} />
        </div>
      </form>
    </Form>
  );
};

export default CreateTmsForm;
