import { useEffect } from 'react';

import { useRecoilState, useRecoilValue } from 'recoil';

import { Command } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';
import {
  SelectTreeArrow,
  SelectTreeIndentation,
} from 'erxes-ui/modules/select-tree/components/SelectTree';

import { TagBadge } from './TagBadge';

import { hideChildrenAtomFamily } from '@/products/product-category/states/ProductCategory';
import { useSelectTags } from '@/tags/contexts/SelectTagsContext';
import { ITag } from '@/tags/types/tagTypes';

export function SelectTagItem(props: ITag & { hasChildren: boolean }) {
  const { _id, order, hasChildren, parentId } = props || {};
  const { selectedTags, handleSelect } = useSelectTags();
  const [hideChildren, setHideChildren] = useRecoilState(
    hideChildrenAtomFamily(_id)
  );
  const isHidden = useRecoilValue(hideChildrenAtomFamily(parentId || ''));

  const isSelected = !!(selectedTags as ITag[])?.find((t) => t._id === _id);

  useEffect(() => {
    if (isHidden) {
      setHideChildren(isHidden);
    }
  }, [isHidden]);

  if (isHidden) {
    return null;
  }

  return (
    <div className="flex items-center">
      <SelectTreeIndentation order={order} />
      {hasChildren && (
        <SelectTreeArrow
          isClosed={hideChildren}
          onClick={() => setHideChildren(!hideChildren)}
        />
      )}
      <Command.Item
        value={_id}
        onSelect={() => handleSelect(props)}
        className={cn('flex-auto', isSelected && 'bg-muted')}
      >
        <TagBadge {...props} />
      </Command.Item>
    </div>
  );
}
