export interface IRecordTableCursorPageInfo {
  endCursor?: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
}

export enum EnumCursorDirection {
  FORWARD = 'forward',
  BACKWARD = 'backward',
}

export interface IRecordTableCursorContext {
  scrollRef: React.RefObject<HTMLDivElement>;
  isFetchBackward: boolean;
  setIsFetchBackward: (isFetchBackward: boolean) => void;
  distanceFromBottomRef: React.MutableRefObject<number>;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  loading?: boolean;
}
