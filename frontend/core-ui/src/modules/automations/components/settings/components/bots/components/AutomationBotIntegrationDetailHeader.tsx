import { useAutomationBotTotalCount } from '@/automations/components/settings/components/bots/hooks/useAutomationBots';
import { IAutomationBot } from '@/automations/components/settings/components/bots/types/automationBots';
import { IconPlus } from '@tabler/icons-react';
import { Button, cn, Sheet, Spinner } from 'erxes-ui';

export const AutomationBotIntegrationDetailHeader = ({
  botIntegrationConstant,
}: {
  botIntegrationConstant: IAutomationBot;
}) => {
  const { loading, totalCount } = useAutomationBotTotalCount(
    botIntegrationConstant?.totalCountQueryName,
  );

  return (
    <div className="w-96">
      <div className="flex gap-2">
        <div
          className={cn(
            'size-8 rounded overflow-hidden shadow-sm bg-background',
          )}
        >
          <img
            src={botIntegrationConstant.logo}
            alt={botIntegrationConstant.name}
            className="w-full h-full object-contain"
          />
        </div>
        <h6 className="font-semibold text-sm self-center">
          {botIntegrationConstant.label}
        </h6>
        <div className="text-xs text-muted-foreground font-mono ml-auto">
          {loading ? <Spinner /> : totalCount}
        </div>
      </div>
      <div className="text-sm text-muted-foreground font-medium py-2">
        {`Connect and manage ${botIntegrationConstant.label} bots`}
      </div>
    </div>
  );
};
