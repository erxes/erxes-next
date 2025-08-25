import { useResetNodes } from '@/automations/hooks/useResetNodes';
import { useAutomationNodes } from '@/automations/hooks/useAutomationNodes';
import { useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';

export const AutomationBuilderEffect = () => {
  const { triggers, actions, workflows } = useAutomationNodes();
  const { resetNodes } = useResetNodes();

  // useDeepCompareEffect(() => {
  //   resetNodes();
  // }, [triggers, actions, workflows]);

  return <></>;
};

function useDeepCompareEffect(effect: React.EffectCallback, deps: any[]) {
  const prevDeps = useRef<any[]>([]);

  if (!isEqual(prevDeps.current, deps)) {
    prevDeps.current = deps;
  }

  useEffect(effect, [prevDeps.current]);
}
