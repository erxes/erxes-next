import { IntegrationSteps } from '@/integrations/components/IntegrationSteps';
import { IconPlus } from '@tabler/icons-react';
import { Button, Sheet } from 'erxes-ui';
import { FacebookGetAccounts } from './FacebookGetAccounts';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  activeFacebookMessengerAddStepAtom,
  resetFacebookAddStateAtom,
} from '../states/facebookStates';
import { FacebookGetPages } from './FacebookGetPages';
import { FacebookIntegrationSetup } from './FacebookIntegrationSetup';
import { useAtom } from 'jotai';
import { facebookAddSheetAtom } from '../states/facebookStates';

export const FacebookMessengerAddSheet = () => {
  const [facebookAddSheet, setFacebookAddSheet] = useAtom(facebookAddSheetAtom);

  return (
    <div>
      <Sheet open={facebookAddSheet} onOpenChange={setFacebookAddSheet}>
        <Sheet.Trigger asChild>
          <Button>
            <IconPlus />
            Add Facebook Messenger
          </Button>
        </Sheet.Trigger>
        <Sheet.View>
          <FacebookMessengerAdd />
        </Sheet.View>
      </Sheet>
    </div>
  );
};

export const FacebookMessengerAdd = () => {
  const activeStep = useAtomValue(activeFacebookMessengerAddStepAtom);

  return (
    <>
      {activeStep === 1 && <FacebookGetAccounts />}
      {activeStep === 2 && <FacebookGetPages />}
      {activeStep === 3 && <FacebookIntegrationSetup />}
    </>
  );
};

export const FacebookMessengerAddLayout = ({
  children,
  actions,
}: {
  children: React.ReactNode;
  actions: React.ReactNode;
}) => {
  const resetForm = useSetAtom(resetFacebookAddStateAtom);

  return (
    <>
      <Sheet.Header>
        <Sheet.Title>Add Facebook Messenger</Sheet.Title>
        <Sheet.Close />
      </Sheet.Header>
      <Sheet.Content className="flex flex-col overflow-hidden">
        {children}
      </Sheet.Content>
      <Sheet.Footer>
        <Sheet.Close asChild>
          <Button
            className="mr-auto text-muted-foreground"
            variant="ghost"
            onClick={resetForm}
          >
            Cancel
          </Button>
        </Sheet.Close>
        {actions}
      </Sheet.Footer>
    </>
  );
};

export const FacebookMessengerAddSteps = ({
  title,
  step,
  description,
}: {
  title: string;
  step: number;
  description: string;
}) => {
  return (
    <IntegrationSteps
      step={step}
      title="Connect accounts"
      stepsLength={3}
      description={description}
    />
  );
};
