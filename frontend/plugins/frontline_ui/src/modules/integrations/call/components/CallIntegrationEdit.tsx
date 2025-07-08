import { callEditSheetAtom } from '@/integrations/call/states/callEditSheetAtom';
import { useAtom } from 'jotai';
import { Sheet, Spinner, toast } from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CALL_INTEGRATION_FORM_SCHEMA } from '@/integrations/call/constants/callIntegrationAddSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { CallIntegrationForm } from '@/integrations/call/components/CallIntegrationForm';
import { useEffect } from 'react';
import { useIntegrationDetail } from '@/integrations/hooks/useIntegrationDetail';
import { useCallIntegrationDetail } from '@/integrations/call/hooks/useCallIntegrationDetail';
import { useIntegrationEdit } from '@/integrations/hooks/useIntegrationEdit';

export const CallIntegrationSheetEdit = () => {
  const [callEditSheet, setCallEditSheet] = useAtom(callEditSheetAtom);

  return (
    <Sheet open={!!callEditSheet} onOpenChange={() => setCallEditSheet(null)}>
      <Sheet.View className="sm:max-w-3xl">
        <CallIntegrationEdit />
      </Sheet.View>
    </Sheet>
  );
};

export const CallIntegrationEdit = () => {
  const [integrationId, setEditSheet] = useAtom(callEditSheetAtom);
  const { integrationDetail, loading } = useIntegrationDetail({
    integrationId,
  });
  const { callsIntegrationDetail, loading: callLoading } =
    useCallIntegrationDetail();

  const { editIntegration, loading: editLoading } = useIntegrationEdit();

  const form = useForm<z.infer<typeof CALL_INTEGRATION_FORM_SCHEMA>>({
    resolver: zodResolver(CALL_INTEGRATION_FORM_SCHEMA),
  });

  const onSubmit = (data: z.infer<typeof CALL_INTEGRATION_FORM_SCHEMA>) => {
    editIntegration({
      variables: {
        _id: integrationId,
        name: data.name,
        brandId: data.brandId,
        channelIds: data.channelIds,
        details: {
          phone: data.phone,
          wsServer: data.websocketServer,
          queues: data.queues?.split(',') || [],
          operators: data.operators,
        },
      },
      refetchQueries: [
        'Integrations',
        'CallIntegrationDetail',
        'IntegrationDetail',
      ],
      onCompleted() {
        setEditSheet(null);
      },
      onError(e) {
        toast({
          title: 'Uh oh! Something went wrong.',
          description: e.message,
          variant: 'destructive',
        });
        setEditSheet(null);
      },
    });
  };

  useEffect(() => {
    if (integrationDetail && !loading) {
      form.reset({
        name: integrationDetail.name || '',
        phone: callsIntegrationDetail?.phone || '',
        websocketServer: callsIntegrationDetail?.wsServer || '',
        queues: callsIntegrationDetail?.queues || '',
        operators: callsIntegrationDetail?.operators || '',
        brandId: integrationDetail.brandId,
        channelIds:
          integrationDetail.channels?.map((channel) => channel._id) || [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [integrationDetail, loading]);

  if (loading || callLoading) {
    return <Spinner className="h-full" />;
  }

  return (
    <CallIntegrationForm
      form={form}
      onSubmit={onSubmit}
      loading={editLoading}
    />
  );
};
