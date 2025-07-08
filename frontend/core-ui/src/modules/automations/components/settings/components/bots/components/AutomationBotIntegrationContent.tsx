import { IAutomationBot } from '@/automations/components/settings/components/bots/types/automationBots';
import { RenderPluginsComponent } from '~/plugins/components/RenderPluginsComponent';

export const AutomationBotIntegrationContent = ({
  botIntegrationConstant,
}: {
  botIntegrationConstant: IAutomationBot;
}) => {
  return (
    <RenderPluginsComponent
      pluginName={`${botIntegrationConstant.pluginName}_ui`}
      remoteModuleName="automations"
      moduleName={botIntegrationConstant.moduleName}
      props={{
        componentType: 'automationBotsContent',
      }}
    />
  );
};
