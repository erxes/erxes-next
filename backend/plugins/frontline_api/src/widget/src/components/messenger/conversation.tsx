import { AvatarImage, Avatar, AvatarFallback } from '../ui/avatar';
import { AvatarGroup } from '../messenger/avatar-group';
import {
  activeTabAtom,
  connectionAtom,
  conversationIdAtom,
} from '@/components/messenger/atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  GET_SUPPORTERS,
  GET_USER_DETAIL,
} from '@/components/messenger/graphql/queries';
import { useQuery } from '@apollo/client';
import { IDetail, ISupporter } from '@/types';
import { readImage, formatDateISOStringToRelativeDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import {
  useReadConversation,
  type ReadConversationResult,
} from './hooks/useReadConversation';

interface IConversationMessage {
  _id: string;
  content: string;
  createdAt: Date;
  fromBot: boolean;
  customerId: string;
  isCustomerRead: boolean;
  userId: string;
  user: {
    _id: string;
    isOnline: boolean;
    details: {
      avatar: string;
      fullName: string;
    };
  };
}

export function EmptyChat() {
  const connection = useAtomValue(connectionAtom);
  const { messengerData } = connection?.data || {};
  const { responseRate, supporterIds } = messengerData || {};
  const { data } = useQuery(GET_SUPPORTERS, {
    variables: { ids: supporterIds },
  });
  const { list } = data?.users || [];
  return (
    <div className="flex flex-col gap-4 font-medium text-sm">
      <div className="my-auto flex items-center gap-2">
        <AvatarGroup max={3}>
          {list &&
            list?.map((supporter: ISupporter) => (
              <Avatar className="border-2 border-sidebar">
                <AvatarImage
                  src={readImage(supporter.details.avatar)}
                  alt={supporter.details.firstName}
                  className="shrink-0 object-cover"
                />
                <AvatarFallback>
                  {supporter.details.firstName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
        </AvatarGroup>
        <span className="text-zinc-400">Our usual reply time</span>{' '}
        <mark className="bg-transparent text-[#4F46E5]">
          ({responseRate || 'A few minutes'})
        </mark>
      </div>
    </div>
  );
}

export function ConversationMessage({
  conversation,
  conversationId,
  participant,
}: {
  conversationId: string;
  conversation?: IConversationMessage;
  participant?: {
    _id: string;
    details: {
      avatar: string;
      fullName: string;
      description: string;
      location: string;
      position: string;
      shortName: string;
    };
  };
}) {
  const setConversationId = useSetAtom(conversationIdAtom);
  const setActiveTab = useSetAtom(activeTabAtom);
  const { data } = useQuery(GET_USER_DETAIL, {
    variables: { _id: participant?._id },
  });
  const { userDetail: user } = data || {};
  console.log('user', user);

  const { readConversation } = useReadConversation();
  const { userId, customerId } = conversation || {};

  const handleClick = () => {
    readConversation({
      variables: { conversationId },
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
        id={conversation?._id}
        tabIndex={0}
        className="flex items-center gap-3 cursor-pointer py-3"
        onClick={handleClick}
      >
        <Avatar>
          <AvatarImage
            src={'assets/user.webp'}
            className="shrink-0 object-cover"
            alt={'you'}
          />
          <AvatarFallback>{'C'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1 text-sm font-medium text-accent-foreground overflow-x-hidden">
          <span
            className="truncate line-clamp-1 w-auto"
            dangerouslySetInnerHTML={{ __html: conversation?.content || '' }}
          />
          <span className="text-xs text-accent-foreground">
            {'you'} ·{' '}
            {formatDateISOStringToRelativeDate(
              conversation?.createdAt as unknown as string,
            )}
          </span>
        </div>
      </div>
    );
  } else if (userId) {
    return (
      <div
        role="tabpanel"
        id={conversation?._id}
        tabIndex={0}
        className="flex items-center gap-3 cursor-pointer py-3"
        onClick={handleClick}
      >
        <Avatar>
          <AvatarImage
            src={readImage(user?.details?.avatar) || 'assets/user.webp'}
            className="shrink-0 object-cover"
            alt={user?.details?.firstName}
          />
          <AvatarFallback>
            {user?.details?.firstName?.charAt(0) || 'C'}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1 text-sm font-medium text-accent-foreground overflow-x-hidden">
          <span
            className="truncate line-clamp-1 w-auto"
            dangerouslySetInnerHTML={{ __html: conversation?.content || '' }}
          />
          <span className="text-xs text-accent-foreground">
            {user?.details?.shortName || user?.details?.firstName || 'operator'}{' '}
            ·{' '}
            {formatDateISOStringToRelativeDate(
              conversation?.createdAt as unknown as string,
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
}: {
  content: string;
  src?: string;
  createdAt: Date;
}) {
  return (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <Button
          variant="ghost"
          className="flex items-end gap-2 p-0 size-auto hover:bg-transparent"
        >
          <Avatar>
            <AvatarImage
              src={readImage(src || 'assets/user.webp')}
              className="shrink-0 object-cover"
              alt="Erxes"
            />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <div
            className="h-auto font-medium flex flex-col justify-start items-start text-[13px] leading-relaxed text-zinc-900 text-left gap-1 px-3 py-2 bg-black/5 rounded-lg"
            dangerouslySetInnerHTML={{
              __html:
                content || '<p>Hello! Have you fixed your problem yet?</p>',
            }}
          />
          <span className="text-muted-foreground text-xs self-center">
            {formatDateISOStringToRelativeDate(createdAt.toISOString())}
          </span>
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
          className="flex items-end size-auto gap-2 flex-row ml-auto p-0 hover:bg-transparent"
        >
          <span className="text-muted-foreground text-xs self-center">
            {formatDateISOStringToRelativeDate(createdAt.toISOString())}
          </span>
          <div
            className="h-auto font-medium flex flex-col justify-start items-start text-[13px] leading-relaxed text-zinc-900 text-left gap-1 px-3 py-2 bg-[#4F46E51A] rounded-lg"
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
