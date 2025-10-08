import { AvatarImage, Avatar, AvatarFallback } from '../ui/avatar';
import { AvatarGroup } from '../messenger/avatar-group';
import {
  activeTabAtom,
  connectionAtom,
  conversationIdAtom,
} from '@/components/messenger/atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import { IMessage, ISupporter } from '@/types';
import { readImage, formatDateISOStringToRelativeDate, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import {
  useReadConversation,
  type ReadConversationResult,
} from './hooks/useReadConversation';
import { useGetMessengerSupporters } from '@/components/messenger/hooks/useGetMessengerSupporters';

export function EmptyChat() {
  const connection = useAtomValue(connectionAtom);
  const { messengerData } = connection?.data || {};
  const { responseRate } = messengerData || {};
  const { list } = useGetMessengerSupporters();
  return (
    <div className="flex flex-col gap-4 font-medium text-sm">
      <div className="my-auto flex items-center gap-2">
        <AvatarGroup max={3}>
          {list &&
            list?.map((supporter: ISupporter) => (
              <Avatar className="border-2 border-sidebar">
                <AvatarImage
                  src={readImage(supporter.details.avatar)}
                  alt={
                    supporter.details.fullName || supporter.details.firstName
                  }
                  className="shrink-0 object-cover"
                />
                <AvatarFallback>
                  {supporter.details.firstName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
        </AvatarGroup>
        <span className="text-muted-foreground font-medium text-sm">
          Our usual reply time
        </span>{' '}
        <mark className="bg-transparent text-primary font-medium text-sm">
          ({`a few ${responseRate}` || 'a few minutes'})
        </mark>
      </div>
    </div>
  );
}

export function ConversationMessage({
  conversationId,
  messege,
}: {
  conversationId: string;
  messege?: IMessage;
}) {
  const setConversationId = useSetAtom(conversationIdAtom);
  const setActiveTab = useSetAtom(activeTabAtom);

  const { readConversation } = useReadConversation();
  const { userId, customerId, user } = messege || {};

  const handleClick = () => {
    readConversation({
      variables: { conversationId: conversationId },
      onCompleted: (data: ReadConversationResult) => {
        setConversationId(data.widgetsReadConversationMessages);
        setActiveTab('chat');
      },
    });
  };

  if (customerId) {
    return (
      <div
        role="tabpanel"
        id={messege?._id}
        tabIndex={0}
        className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent rounded-md transition-all duration-300"
        onClick={handleClick}
      >
        <Avatar>
          <AvatarImage className="shrink-0 object-cover" alt={'you'} />
          <AvatarFallback>{'C'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1 text-sm font-medium text-muted-foreground overflow-x-hidden">
          <span
            className="truncate line-clamp-1 w-auto"
            dangerouslySetInnerHTML={{ __html: messege?.content || '' }}
          />
          <span className="text-sm text-muted-foreground">
            {'you'} ·{' '}
            {formatDateISOStringToRelativeDate(
              messege?.createdAt as unknown as string,
            )}
          </span>
        </div>
      </div>
    );
  } else if (userId) {
    return (
      <div
        role="tabpanel"
        id={messege?._id}
        tabIndex={0}
        className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent rounded-md transition-all duration-300"
        onClick={handleClick}
      >
        <Avatar>
          <AvatarImage
            src={readImage(user?.details?.avatar) || 'assets/user.webp'}
            className="shrink-0 object-cover"
            alt={user?.details?.fullName}
          />
          <AvatarFallback>
            {user?.details?.fullName?.charAt(0) || 'C'}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1 text-sm font-medium text-muted-foreground overflow-x-hidden">
          <span
            className="truncate line-clamp-1 w-auto"
            dangerouslySetInnerHTML={{ __html: messege?.content || '' }}
          />
          <span className="text-sm text-muted-foreground">
            {user?.details?.fullName || user?.details?.firstName || 'operator'}{' '}
            ·{' '}
            {formatDateISOStringToRelativeDate(
              messege?.createdAt as unknown as string,
            )}
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export function OperatorMessage({
  content,
  src,
  createdAt,
  showAvatar = true,
  isFirstMessage,
  isLastMessage,
  isMiddleMessage,
  isSingleMessage,
}: {
  content: string;
  src?: string;
  createdAt: Date;
  showAvatar?: boolean;
  isFirstMessage?: boolean;
  isLastMessage?: boolean;
  isMiddleMessage?: boolean;
  isSingleMessage?: boolean;
}) {
  return (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <Button
          variant="ghost"
          className="flex group/operator-message items-end gap-2 p-0 mr-auto size-auto hover:bg-transparent"
        >
          {showAvatar ? (
            <Avatar>
              <AvatarImage
                src={readImage(src || 'assets/user.webp')}
                className="shrink-0 object-cover size-8"
                alt="Erxes"
              />
              <AvatarFallback>C</AvatarFallback>
            </Avatar>
          ) : (
            <div className="size-8" />
          )}
          <div
            className={cn(
              'h-auto font-medium flex flex-col justify-start items-start text-[13px] leading-relaxed text-foreground text-left gap-1 px-3 py-2 bg-muted',
              isFirstMessage && 'rounded-md rounded-bl-sm rounded-t-lg',
              isLastMessage && 'rounded-md rounded-tl-sm rounded-b-lg',
              isMiddleMessage && 'rounded-r-md rounded-l-sm',
              isSingleMessage && 'rounded-md',
            )}
            dangerouslySetInnerHTML={{
              __html:
                content || '<p>Hello! Have you fixed your problem yet?</p>',
            }}
          />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        {format(createdAt, 'MMM dd, yyyy hh:mm aa')}
      </Tooltip.Content>
    </Tooltip>
  );
}

export const CustomerMessage = ({
  content,
  createdAt,
}: {
  content?: string;
  createdAt: Date;
}) => {
  return (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <Button
          variant="ghost"
          className="flex group/customer-message items-end size-auto gap-2 flex-row ml-auto p-0 hover:bg-transparent"
        >
          <span className="text-muted-foreground hidden group-hover/customer-message:block text-xs self-center">
            {formatDateISOStringToRelativeDate(createdAt.toISOString())}
          </span>
          <div
            className={cn(
              'h-auto font-medium flex flex-col justify-start items-start text-[13px] leading-relaxed text-zinc-900 text-left gap-1 px-3 py-2 bg-accent rounded-md',
            )}
            dangerouslySetInnerHTML={{
              __html:
                content || '<p>Hello! Have you fixed your problem yet?</p>',
            }}
          />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        {format(createdAt, 'MMM dd, yyyy hh:mm aa')}
      </Tooltip.Content>
    </Tooltip>
  );
};

export const BotMessage = ({ content }: { content?: string }) => {
  return (
    <div className="flex items-end gap-2">
      <div className="h-auto font-medium flex flex-col justify-start items-start text-sm leading-relaxed text-foreground text-left gap-1 p-3 bg-transparent">
        <p>{content}</p>
      </div>
    </div>
  );
};
