/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';

export const useCursorScroll = ({
  dataLength,
  hasPreviousPage,
  loading,
  offset = 102,
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
      scrollRef.current.scrollTop = offset;
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      if (distanceFromBottomRef.current && isFetchBackward) {
        scrollRef.current.scrollTop =
          scrollRef.current.scrollHeight - distanceFromBottomRef.current;
        distanceFromBottomRef.current = 0;
        setIsFetchBackward(false);
      }
    }
  }, [dataLength]);

  return {
    scrollRef,
    isFetchBackward,
    setIsFetchBackward,
    distanceFromBottomRef,
  };
};
