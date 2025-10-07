import { useAtomValue } from 'jotai';
import { HeaderItemsList } from './header-items-list';
import { connectionAtom } from '@/components/messenger/atoms';
import { WelcomeMessage } from '@/components/messenger/constants';
import { formatTimeZoneLabel } from '@/lib/formatTimezone';

export function HeroSection() {
  const connection = useAtomValue(connectionAtom);
  const { messengerData } = connection?.data || {};
  const { messages, onlineHours, showTimezone, timezone } = messengerData || {};
  return (
    <div className="flex flex-col gap-4">
      <div className="gap-2 flex flex-col">
        <div className="font-semibold text-accent-foreground text-base">
          {messages?.greetings?.title || WelcomeMessage.TITLE}
        </div>
        <div className="text-muted-foreground font-medium text-sm">
          {messages?.greetings?.message || WelcomeMessage.MESSAGE}{' '}
          {messages?.thank || ''}
          {'. '}
          {onlineHours?.map(
            (hour: { day: string; from: string; to: string }) => (
              <span key={hour.day}>
                ({hour.from} болон {hour.to} хооронд
                {showTimezone && ` (${formatTimeZoneLabel(timezone)})`})
              </span>
            ),
          )}
        </div>
      </div>
      <HeaderItemsList />
    </div>
  );
}
