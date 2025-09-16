import { NodeData } from '@/automations/types';

// Custom hook for trigger node content logic
export const useNodeContent = (data: NodeData) => {
  const hasError = Boolean(data?.error);
  const isCustom = Boolean(data?.isCustom);
  const hasConfig = Boolean(Object.keys(data?.config || {}).length);

  return {
    hasError,
    isCustom,
    hasConfig,
    shouldRender: isCustom && hasConfig && !hasError,
  };
};
