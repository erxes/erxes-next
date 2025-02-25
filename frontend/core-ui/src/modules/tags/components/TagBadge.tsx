import { Button } from 'erxes-ui/components';

import { ITag } from '@/tags/types/tagTypes';

export function TagBadge({ name }: ITag) {
  return (
    <Button variant="outline" className="h-min hover:bg-border">
      {name}
    </Button>
  );
}
