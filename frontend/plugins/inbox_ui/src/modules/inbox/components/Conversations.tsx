import { useConversations } from '@/inbox/hooks/useConversations';
import {
  Badge,
  BlockEditorReadOnly,
  Button,
  Checkbox,
  RelativeDateDisplay,
  Separator,
} from 'erxes-ui';
import { cn } from 'erxes-ui/lib';
import { ConversationContext } from '~/modules/inbox/context/ConversationContext';
import { IConversation } from '@/inbox/types/Conversation';
import { useConversationContext } from '@/inbox/hooks/useConversationContext';
import { currentUserState, CustomerInline } from 'ui-modules';
import { useAtomValue, useSetAtom } from 'jotai';
import { INTEGRATION_ICONS } from '@/inbox/constants/integrationImages';
import { IconLoader, IconMail } from '@tabler/icons-react';
import { useInView } from 'react-intersection-observer';
import { ConversationsHeader } from './ConversationsHeader';
import { ConversationFilter } from './ConversationFilter';
import { useMultiQueryState, useQueryState } from '../hooks/useQueryState';
import { FilterTags } from './FilterTags';
import { activeConversationState } from '../state/activeConversationState';
import {
  selectConversationsState,
  setSelectConversationsState,
} from '../state/selectConversationsState';
import { ConversationListContext } from '../context/ConversationListContext';
import { useEffect, useState } from 'react';

export const Conversations = () => {
  const [ref] = useInView({
    onChange(inView) {
      if (inView) {
        handleFetchMore();
      }
    },
  });
  const [{ channelId, integrationType, unassigned, status }] =
    useMultiQueryState<{
      channelId: string;
      integrationType: string;
      unassigned: string;
      status: string;
    }>(['channelId', 'integrationType', 'unassigned', 'status']);

  const { totalCount, conversations, handleFetchMore, loading } =
    useConversations({
      variables: {
        limit: 50,
        channelId,
        integrationType,
        unassigned,
        status,
      },
    });

  return (
    <ConversationListContext.Provider
      value={{
        conversations,
        loading,
        totalCount,
      }}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <ConversationsHeader>
          <ConversationFilter />
          <FilterTags />
        </ConversationsHeader>

        <Separator />
        <div className="h-full w-full overflow-y-auto">
          {conversations?.map((conversation: IConversation) => (
            <ConversationContext.Provider
              key={conversation._id}
              value={conversation}
            >
              <ConversationItem />
            </ConversationContext.Provider>
          ))}
          {!loading &&
            conversations?.length > 0 &&
            conversations?.length < totalCount && (
              <Button
                variant="ghost"
                ref={ref}
                className="pl-6 h-8 w-full text-muted-foreground"
                asChild
              >
                <div>
                  <IconLoader className="size-4 animate-spin" />
                  loading more...
                </div>
              </Button>
            )}
        </div>
      </div>
    </ConversationListContext.Provider>
  );
};

export const ConversationItem = () => {
  const [conversationId] = useQueryState<string>('conversationId');
  const [detailView] = useQueryState<boolean>('detailView');

  const { integration, createdAt, updatedAt, customer } =
    useConversationContext();
  const { brand } = integration || {};

  if (conversationId || detailView) {
    return (
      <ConversationContainer className="p-4 pl-6 h-auto overflow-hidden flex-col items-start">
        <CustomerInline.Provider customer={customer}>
          <div className="flex w-full gap-3 leading-tight">
            <ConversationSelector />
            <div className="flex-1 space-y-1 truncate">
              <CustomerInline.Title className="truncate" />
              <div className="font-normal text-accent-foreground text-xs">
                {brand?.name}
              </div>
            </div>
            <div className="ml-auto text-accent-foreground font-medium">
              <RelativeDateDisplay value={updatedAt || createdAt} />
            </div>
          </div>
          <ConversationItemContent />
        </CustomerInline.Provider>
      </ConversationContainer>
    );
  }

  return (
    <ConversationContainer>
      <CustomerInline.Provider customer={customer}>
        <ConversationSelector />
        <CustomerInline.Title className="w-56 truncate flex-none text-foreground" />
        <ConversationItemContent />
        <div className="ml-auto font-medium text-accent-foreground w-32 truncate flex-none">
          to {brand?.name}
        </div>
        <div className="w-32 text-right flex-none">
          <RelativeDateDisplay value={updatedAt || createdAt} />
        </div>
      </CustomerInline.Provider>
    </ConversationContainer>
  );
};

export const ConversationItemContent = () => {
  const { content } = useConversationContext();
  return (
    <div className="truncate w-full h-4 [&_*]:text-sm [&_*]:leading-tight [&_*]:font-medium">
      <BlockEditorReadOnly content={content} />
    </div>
  );
};

const ConversationContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [{ conversationId }, setValues] = useMultiQueryState<{
    conversationId: string;
    detailView: boolean;
  }>(['conversationId', 'detailView']);
  const setActiveConversation = useSetAtom(activeConversationState);
  const conversation = useConversationContext();
  const { _id, readUserIds } = conversation || {};
  const currentUser = useAtomValue(currentUserState);
  const isRead = readUserIds?.includes(currentUser?._id || '');

  return (
    <Button
      key={_id}
      variant={isRead ? 'secondary' : 'ghost'}
      size="lg"
      className={cn(
        'flex rounded-none h-10 justify-start px-4 gap-3 hover:bg-primary/10 hover:text-foreground w-full',
        className,
        isRead && 'font-medium text-muted-foreground',
        conversationId === _id &&
          'bg-secondary text-foreground hover:bg-secondary',
      )}
      asChild
      onClick={() => {
        setActiveConversation(conversation);
        setValues({
          conversationId: _id,
          detailView: true,
        });
      }}
    >
      <div>{children}</div>
    </Button>
  );
};

const ConversationSelector = () => {
  const [conversationId] = useQueryState<string>('conversationId');

  return (
    <div
      className={cn(
        'group grid place-items-center relative size-6',
        conversationId && 'size-8',
      )}
    >
      <div className="absolute size-full bg-primary/10 rounded-full" />
      <ConversationCheckbox />
      <div className="transition-opacity duration-200 relative opacity-100 group-hover:opacity-0 peer-data-[state=checked]:opacity-0">
        <CustomerInline.Avatar
          size={conversationId ? 'xl' : 'lg'}
          className=""
        />
        <ConversationIntegrationBadge />
      </div>
    </div>
  );
};

const ConversationCheckbox = () => {
  const { _id } = useConversationContext();
  const [isChecked, setIsChecked] = useState(false);
  const setSelectConversations = useSetAtom(setSelectConversationsState);

  return (
    <>
      <Checkbox
        checked={isChecked}
        className="absolute transition-opacity duration-200 opacity-0 group-hover:opacity-100 data-[state=checked]:opacity-100 z-10"
        onClick={(e) => e.stopPropagation()}
        onCheckedChange={() => setSelectConversations(_id)}
      />
      <ConversationCheckedEffect
        isChecked={isChecked}
        setIsChecked={setIsChecked}
      />
    </>
  );
};

const ConversationCheckedEffect = ({
  isChecked,
  setIsChecked,
}: {
  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;
}) => {
  const { _id } = useConversationContext();
  const selectConversations = useAtomValue(selectConversationsState);

  useEffect(() => {
    if (isChecked !== selectConversations.includes(_id)) {
      setIsChecked(selectConversations.includes(_id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectConversations]);

  return null;
};

const ConversationIntegrationBadge = () => {
  const { integration } = useConversationContext();
  const { kind } = integration || {};

  const Icon =
    INTEGRATION_ICONS[kind as keyof typeof INTEGRATION_ICONS] ?? IconMail;

  return (
    <Badge className="absolute -bottom-1 -right-1 size-4 rounded-full bg-background flex justify-center items-center p-0 text-purple-700">
      <Icon className="size-4 flex-none text-primary" />
    </Badge>
  );
};
