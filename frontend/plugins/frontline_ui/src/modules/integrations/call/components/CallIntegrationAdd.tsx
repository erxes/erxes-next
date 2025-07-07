import { useAtom } from 'jotai';
import { callAddSheetAtom } from '../states/callAddSheetAtom';
import { Button, Sheet } from 'erxes-ui';
import { IconPlus } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CALL_INTEGRATION_FORM_SCHEMA } from '@/integrations/call/constants/callIntegrationAddSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { CallIntegrationForm } from '@/integrations/call/components/CallIntegrationForm';

export const CallIntegrationAddSheet = () => {
  const [callAddSheet, setCallAddSheet] = useAtom(callAddSheetAtom);

  return (
    <Sheet open={callAddSheet} onOpenChange={setCallAddSheet}>
      <Sheet.Trigger asChild>
        <Button>
          <IconPlus />
          Add Call
        </Button>
      </Sheet.Trigger>
      <Sheet.View className="sm:max-w-3xl">
        <CallIntegrationAdd />
      </Sheet.View>
    </Sheet>
  );
};

export const CallIntegrationAdd = () => {
  const form = useForm<z.infer<typeof CALL_INTEGRATION_FORM_SCHEMA>>({
    resolver: zodResolver(CALL_INTEGRATION_FORM_SCHEMA),
  });

  const onSubmit = (data: z.infer<typeof CALL_INTEGRATION_FORM_SCHEMA>) => {
    console.log(data);
  };

  return <CallIntegrationForm form={form} onSubmit={onSubmit} />;
};
