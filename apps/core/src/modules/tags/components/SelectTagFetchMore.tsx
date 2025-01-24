import { Command } from 'erxes-ui/components';
import { IconLoader } from '@tabler/icons-react';
import { useInView } from 'react-intersection-observer';
import { SelectTagFetchMoreProps } from '@/tags/types/tagTypes';

export function SelectTagFetchMore({
  fetchMore,
  tagsLength,
  totalCount,
}: SelectTagFetchMoreProps) {
  const { ref: bottomRef } = useInView({
    onChange: (inView) => inView && fetchMore(),
  });

  if (!tagsLength || tagsLength >= totalCount) {
    return null;
  }

  return (
    <Command.Item value="-" disabled ref={bottomRef}>
      <IconLoader className="w-4 h-4 animate-spin text-muted-foreground mr-1" />
      Loading more...
    </Command.Item>
  );
}
