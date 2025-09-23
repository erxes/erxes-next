import { TAutomationDelayConfig } from '@/automations/components/builder/nodes/actions/delay/types/automationDelay';
import { MetaFieldLine } from '@/automations/components/builder/nodes/MetaFieldLine';
import { NodeContentComponentProps } from '@/automations/components/builder/nodes/types/coreAutomationActionTypes';

export const DelayNodeContent = ({
  config,
}: NodeContentComponentProps<TAutomationDelayConfig>) => {
  const { value, type } = config || {};
  return <MetaFieldLine fieldName="Delay for:" content={`${value} ${type}s`} />;
};
