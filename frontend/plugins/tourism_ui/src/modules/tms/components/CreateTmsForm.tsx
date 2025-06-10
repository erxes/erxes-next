import { TmsCreateSheetHeader } from '@/tms/components/CreateTmsSheet';

import { Sheet, Form, useToast } from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { TmsFormSchema, TmsFormType } from '@/tms/constants/formSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApolloError } from '@apollo/client';
import { TmsInformationFields } from '@/tms/components/TmsInformationFields';
import Preview from '@/tms/components/Preview';
import { useCreateBranch } from '../hooks/CreateBranch';

const CreateTmsForm = ({
  onOpenChange,
  onSuccess,
}: {
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}) => {
  const { createBranch } = useCreateBranch();
  const form = useForm<TmsFormType>({
    resolver: zodResolver(TmsFormSchema),
    defaultValues: {
      name: '',
      color: '#4F46E5',
      logo: '',
      favIcon: '',
      generalManager: [],
      managers: [],
      payment: [],
      token: '',
      otherPayments: [],
    },
  });

  const watchedValues = form.watch();
  const { toast } = useToast();

  const onSubmit = (data: TmsFormType) => {
    createBranch({
      variables: {
        name: data.name,
        generalManagerIds: data.generalManager || [],
        managerIds: data.managers || [],
        paymentIds: data.payment || [],
        permissionConfig:
          data.otherPayments?.map((payment) => ({
            _id: payment._id || '',
            type: payment.type,
            title: payment.title,
            icon: payment.icon,
            config: payment.config,
          })) || [],
        erxesAppToken: data.token,
        uiOptions: {
          logo: data.logo,
          favIcon: data.favIcon,
          colors: {
            primary: data.color,
          },
        },
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
          description: 'Branch created successfully',
        });
        form.reset();
        onOpenChange?.(false);
        onSuccess?.();
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <TmsCreateSheetHeader />
        <Sheet.Content className="grid min-h-0 overflow-y-auto lg:grid-cols-2">
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
