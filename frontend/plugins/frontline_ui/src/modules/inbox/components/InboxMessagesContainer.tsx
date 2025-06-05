import { ScrollArea } from 'erxes-ui/components';
import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { InboxMessagesSkeleton } from './InboxMessagesSkeleton';

export const InboxMessagesContainer = ({
  fetchMore,
  messagesLength,
  totalCount,
  loading,
  children,
}: React.PropsWithChildren<{
  fetchMore: () => void;
  messagesLength: number;
  totalCount: number;
  loading: boolean;
}>) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [fetchMoreRef] = useInView({
    threshold: 0,
    onChange(inView) {
      if (inView && viewportRef.current) {
        distanceFromBottomRef.current =
          viewportRef.current.scrollHeight - viewportRef.current.scrollTop;
        fetchMore();
      }
    },
  });
  const distanceFromBottomRef = useRef(0);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (viewportRef.current) {
        viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
      }
    });
  };
  useEffect(() => {
    if (viewportRef.current) {
      if (distanceFromBottomRef.current) {
        viewportRef.current.scrollTop =
          viewportRef.current.scrollHeight - distanceFromBottomRef.current;
        distanceFromBottomRef.current = 0;
      } else {
        scrollToBottom();
      }
    }
    if (messagesLength > 0) {
      scrollToBottom();
    }
  }, [messagesLength]);

  return (
    <ScrollArea.Root className="h-full">
      <ScrollArea.Viewport ref={viewportRef}>
        {messagesLength && totalCount > messagesLength && (
          <p ref={fetchMoreRef} />
        )}
        <div className="flex flex-col w-[648px] mx-auto p-6">{children}</div>
        <InboxMessagesSkeleton isFetched={!loading && !!messagesLength} />
      </ScrollArea.Viewport>
      <ScrollArea.Bar orientation="vertical" />
      <ScrollArea.Bar orientation="horizontal" />
    </ScrollArea.Root>
  );
};
