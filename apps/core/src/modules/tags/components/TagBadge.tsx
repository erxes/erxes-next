import { Badge } from 'erxes-ui/components';
import { Color } from 'erxes-ui/components/colors';
import { ITag } from '@/tags/types/tagTypes';

export function TagBadge({ colorCode, _id, name }: ITag) {
  return (
    <Badge color={colorCode as Color} colorSeed={_id} className="gap-2">
      {name}
    </Badge>
  );
}
