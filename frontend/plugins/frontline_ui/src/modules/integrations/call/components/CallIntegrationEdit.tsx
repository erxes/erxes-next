import { callEditSheetAtom } from '@/integrations/call/states/callEditSheetAtom';
import { useAtom } from 'jotai';
import { Sheet, Spinner } from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CALL_INTEGRATION_FORM_SCHEMA } from '@/integrations/call/constants/callIntegrationAddSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { CallIntegrationForm } from '@/integrations/call/components/CallIntegrationForm';
import { useCallIntegrationDetail } from '@/integrations/call/hooks/useCallIntegrationDetail';
import { useEffect } from 'react';

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
  const { callsIntegrationDetail, loading } = useCallIntegrationDetail();

  const form = useForm<z.infer<typeof CALL_INTEGRATION_FORM_SCHEMA>>({
    resolver: zodResolver(CALL_INTEGRATION_FORM_SCHEMA),
  });

  const onSubmit = (data: z.infer<typeof CALL_INTEGRATION_FORM_SCHEMA>) => {
    console.log(data);
  };

  useEffect(() => {
    if (callsIntegrationDetail && !loading) {
      form.reset({
        name: callsIntegrationDetail.name,
        phone: callsIntegrationDetail.phone,
        websocketServer: callsIntegrationDetail.wsServer,
        queues: callsIntegrationDetail.queues,
        operators: callsIntegrationDetail.operators,
        brandId: callsIntegrationDetail.brandId,
        channelId: callsIntegrationDetail.channelId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callsIntegrationDetail, loading]);

  if (loading) {
    return <Spinner className="h-full" />;
  }

  return <CallIntegrationForm form={form} onSubmit={onSubmit} />;
};
