import { useFacebookBot } from '@/integrations/facebook/hooks/useFacebookBots';
import { IFacebookBot } from '@/integrations/facebook/types/FacebookBot';
import { Avatar, Label, Separator, Spinner } from 'erxes-ui';
import { useFacebookMessengerTrigger } from '~/widgets/automations/modules/facebook/components/trigger/hooks/useFacebookMessengerTrigger';
import { TMessageTriggerFormCondition } from '~/widgets/automations/modules/facebook/components/trigger/states/messageTriggerFormSchema';

type Props = {
  config: {
    botId: string;
    conditions: TMessageTriggerFormCondition[];
  };
};

export const TriggerConfigContent = ({ config }: Props) => {
  const { conditions = [], botId } = config || {};
  const { triggerConditionsConstans } = useFacebookMessengerTrigger();
  const { bot, loading } = useFacebookBot(botId);

  return (
    <div className="p-2">
      <BotProfile bot={bot} loading={loading} />
      <Separator />
      {conditions.map(
        (condition: TMessageTriggerFormCondition, index: number) => (
          <Condtion
            key={bot?._id}
            bot={bot}
            condition={condition}
            triggerConditionsConstans={triggerConditionsConstans}
            totalCount={
              conditions.filter(({ isSelected }) => isSelected).length
            }
            index={index}
          />
        ),
      )}
    </div>
  );
};

const BotProfile = ({
  bot,
  loading,
}: {
  bot?: IFacebookBot;
  loading: boolean;
}) => {
  if (loading) {
    return <Spinner />;
  }
  if (!bot) {
    return null;
  }

  return (
    <div className="flex flex-row gap-2 items-center">
      <Avatar className="w-8 h-8">
        <Avatar.Image src={bot?.profileUrl || '/images/erxes-bot.svg'} />
        <Avatar.Fallback>{(bot?.name || '').charAt(0)}</Avatar.Fallback>
      </Avatar>
      <Label className="text-muted-foreground">
        {bot?.name || 'Not found bot'}
      </Label>
    </div>
  );
};

const renderDescriptionContent = (
  condition: TMessageTriggerFormCondition,
  bot?: IFacebookBot,
) => {
  if (condition.type === 'direct') {
    return (condition?.conditions || []).map(({ keywords = [] }) =>
      keywords.map(({ text }) => text).join(','),
    );
  }

  if (condition.type === 'persistentMenu') {
    const { persistentMenuIds = [] } = condition || {};
    const { persistentMenus = [] } = bot || {};

    return persistentMenus
      .filter(({ _id }) => persistentMenuIds.includes(_id))
      .map(({ text }) => text)
      .join(',');
  }

  return '';
};

const Condtion = ({
  index,
  bot,
  condition,
  totalCount,
  triggerConditionsConstans = [],
}: {
  index: number;
  condition: TMessageTriggerFormCondition;
  bot?: IFacebookBot;
  triggerConditionsConstans: any[];
  totalCount: number;
}) => {
  if (!condition?.isSelected) {
    return null;
  }

  const { label, description } =
    triggerConditionsConstans.find((c: any) => c.type === condition.type) || {};

  const renderORSeparator = () => {
    if (totalCount > 1 && index + 1 !== totalCount) {
      return <span className="flex justify-center">OR</span>;
    }

    return null;
  };

  return (
    <>
      <div key={condition._id}>
        <p className="font-semibold text-sm">{label}</p>
        <span className="text-accent-foreground">
          {description}
          <span className="text-primary">
            {` ${renderDescriptionContent(condition, bot)}`}
          </span>
        </span>
      </div>
      {renderORSeparator()}
    </>
  );
};
