import {
  useAutomationBots,
  useAutomationBotTotalCount,
} from '@/automations/components/settings/components/bots/hooks/useAutomationBots';
import { IAutomationBot } from '@/automations/components/settings/components/bots/types/automationBots';
import { Card, cn, ScrollArea, Spinner } from 'erxes-ui';
import { Link } from 'react-router';

const BotCard = ({ bot }: { bot: IAutomationBot }) => {
  const { totalCount, loading } = useAutomationBotTotalCount(
    bot.totalCountQueryName,
  );

  return (
    <Card key={bot.name} className="h-auto p-3 flex flex-col gap-2 rounded-lg">
      <Link to={`/settings/automations/bots/${bot.name}`}>
        <div className="flex gap-2">
          <div
            className={cn(
              'size-8 rounded overflow-hidden shadow-sm bg-background',
            )}
          >
            <img
              src={bot.logo}
              alt={bot.name}
              className="w-full h-full object-contain"
            />
          </div>
          <h6 className="font-semibold text-sm self-center">{bot.label}</h6>
          <div className="text-xs text-muted-foreground font-mono ml-auto">
            {loading ? <Spinner /> : totalCount}
          </div>
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          {bot.description}
        </div>
      </Link>
    </Card>
  );
};

const BotsList = ({
  loading,
  bots,
}: {
  loading: boolean;
  bots: IAutomationBot[];
}) => {
  if (loading) {
    return <Spinner />;
  }

  return bots.map((bot) => <BotCard key={bot.name} bot={bot} />);
};

export const AutomationsBotsSettings = () => {
  const { automationBotsConstants, loading } = useAutomationBots();

  return (
    <ScrollArea>
      <div className="h-full w-full mx-auto max-w-3xl px-8 py-5 flex flex-col gap-8">
        <div className="flex flex-col gap-2 px-1">
          <h1 className="text-lg font-semibold">Automation bots</h1>
          <span className="font-normal text-muted-foreground text-sm">
            Set up your bots and start connecting with your customers
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <BotsList bots={automationBotsConstants} loading={loading} />
        </div>
      </div>
    </ScrollArea>
  );
};
