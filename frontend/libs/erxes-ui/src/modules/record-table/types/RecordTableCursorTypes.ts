export interface IRecordTableCursorPageInfo {
  endCursor?: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
}

export interface IRecordTableCursorContext {
  scrollRef: React.RefObject<HTMLDivElement>;
  isFetchBackward: boolean;
  cursorItemIds: string[];
  setCursorItemIds: (ids: string[]) => void;
  setIsFetchBackward: (isFetchBackward: boolean) => void;
  distanceFromBottomRef: React.MutableRefObject<number>;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  loading?: boolean;
}
