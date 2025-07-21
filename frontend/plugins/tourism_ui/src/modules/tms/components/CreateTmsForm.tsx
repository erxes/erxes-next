import { TmsCreateSheetHeader } from '@/tms/components/CreateTmsSheet';

import { Sheet, Form, useToast, Preview, Separator } from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { TmsFormSchema, TmsFormType } from '@/tms/constants/formSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApolloError } from '@apollo/client';
import { TmsInformationFields } from '@/tms/components/TmsInformationFields';
import { useCreateBranch } from '../hooks/CreateBranch';
import { useBranchEdit } from '../hooks/BranchEdit';
import { useBranchDetail } from '../hooks/BranchDetail';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { formDataAtom } from '../states/formDataAtom';

interface PermissionConfig {
  type: string;
  title: string;
  icon: string;
  config?: string;
}

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

  const [, setFormData] = useAtom(formDataAtom);

  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData(value as any);
      const iframe = document.querySelector(
        'iframe[src="/tms/PreviewPage"]',
      ) as HTMLIFrameElement | null;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          { type: 'FORM_DATA_UPDATE', data: value },
          '*',
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [form, setFormData]);

  useEffect(() => {
    if (branchDetail) {
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
          ? branchDetail.permissionConfig.map((config: PermissionConfig) => ({
              type: config.type || '',
              title: config.title || '',
              icon: config.icon || '',
              config: config.config || '',
            }))
          : [],
      });
    }
  }, [branchDetail, form]);

  const { toast } = useToast();

  const onSubmit = (data: TmsFormType) => {
    const permissionConfig =
      data.otherPayments?.map((payment: PermissionConfig) => ({
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
                description:
                  error instanceof Error ? error.message : String(error),
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
        <Sheet.Content className="grid lg:grid-cols-2">
          <div>
            <TmsInformationFields
              form={form}
              onOpenChange={onOpenChange}
              onSubmit={onSubmit}
            />
          </div>
          <div className="hidden lg:block">
            <Preview>
              <div className="bg-background">
                <Preview.Toolbar path="/tms/PreviewPage" />
              </div>
              <Separator />
              <Preview.View iframeSrc="/tms/PreviewPage" />
            </Preview>
          </div>
        </Sheet.Content>
      </form>
    </Form>
  );
};

export default CreateTmsForm;
