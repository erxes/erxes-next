import { isUndefinedOrNull } from 'erxes-ui/utils';
import { useEffect, useRef, useState } from 'react';

export const useCursorScroll = ({
  dataLength,
  hasPreviousPage,
  loading,
  offset,
}: {
  dataLength?: number;
  hasPreviousPage?: boolean;
  loading?: boolean;
  offset?: number;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const distanceFromBottomRef = useRef(0);

  const [isFetchBackward, setIsFetchBackward] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      if (distanceFromBottomRef.current && isFetchBackward) {
        scrollRef.current.scrollTop =
          scrollRef.current.scrollHeight - distanceFromBottomRef.current;
        distanceFromBottomRef.current = 0;
        setIsFetchBackward(false);
      } else if (!isUndefinedOrNull(hasPreviousPage) && offset) {
        scrollRef.current.scrollTop = hasPreviousPage && !loading ? offset : 0;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLength]);

  return {
    scrollRef,
    isFetchBackward,
    setIsFetchBackward,
    distanceFromBottomRef,
  };
};
