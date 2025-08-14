import { IActivity } from '@/activity/types';

export const Name = ({ metadata }: { metadata: IActivity['metadata'] }) => {
  return <div>{metadata.newValue}</div>;
};
