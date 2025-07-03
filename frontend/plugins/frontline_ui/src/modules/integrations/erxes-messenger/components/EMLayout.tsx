import { IntegrationSteps } from '@/integrations/components/IntegrationSteps';
import { erxesMessengerSetupStepAtom } from '@/integrations/erxes-messenger/states/erxesMessengerSetupStates';
import { Button, Sheet } from 'erxes-ui';
import { useAtom, useAtomValue } from 'jotai';

export const EMLayout = ({
  children,
  actions,
  title,
}: {
  children: React.ReactNode;
  actions: React.ReactNode;
  title: string;
}) => {
  const step = useAtomValue(erxesMessengerSetupStepAtom);
  return (
    <>
      <Sheet.Content className="grow">
        <IntegrationSteps
          step={step}
          title={title}
          stepsLength={7}
          description=""
        />
        {children}
      </Sheet.Content>
      <Sheet.Footer>
        <Button variant="secondary" className="mr-auto bg-border">
          Cancel
        </Button>
        {actions}
      </Sheet.Footer>
    </>
  );
};

export const EMLayoutPreviousStepButton = () => {
  const [step, setStep] = useAtom(erxesMessengerSetupStepAtom);
  return (
    <Button
      variant="secondary"
      className="mr-auto bg-border"
      disabled={step === 1}
      onClick={() => setStep(step - 1)}
    >
      Previous step
    </Button>
  );
};
