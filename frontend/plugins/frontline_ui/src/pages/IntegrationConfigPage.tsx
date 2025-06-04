import { FacebookConfigUpdateCollapse } from '@/integrations/facebook/components/FacebookConfigUpdate';

export const IntegrationConfigPage = () => {
  return (
    <div className="flex flex-col gap-4 mx-auto max-w-2xl p-8 w-full">
      <FacebookConfigUpdateCollapse />
    </div>
  );
};
