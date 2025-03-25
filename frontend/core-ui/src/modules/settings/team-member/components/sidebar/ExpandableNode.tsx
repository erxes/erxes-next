import { Collapsible, RadioGroup, Button, cn, Skeleton } from 'erxes-ui';
import { useCountByOptions } from '../../hooks/useCountByOptions';
import { IconCaretRightFilled } from '@tabler/icons-react';
import { useState } from 'react';

interface IData {
  _id: string;
  title: string;
  parentId: string;
}
export function ExpandableNode({
  data,
  index,
  list,
  parentIndex,
  queryKey,
}: {
  data: IData;
  index: number;
  list: IData[];
  parentIndex: string;
  queryKey?: any;
}) {
  const { _id, title } = data;
  const [isOpen, setIsOpen] = useState(false);

  const childNodes = list?.filter((dept) => dept.parentId === _id);
  const hasChildren = childNodes.length > 0;

  const { usersTotalCount, loading } = useCountByOptions({
    variables: { [queryKey]: _id },
  });

  const formattedIndex = parentIndex
    ? `${parentIndex}-${String(index + 1).padStart(2, '0')}`
    : `D${String(index + 1).padStart(2, '0')}`;

  return (
    <div
      key={_id}
      className={cn(
        hasChildren ? 'pl-2 pr-0.5' : 'px-2',
        'has-[[data-state=checked]]:bg-primary/10 w-full items-center relative hover:bg-primary/10 flex cursor-pointer gap-3 rounded-md py-[7.5px] transition-[color,box-shadow] outline-none',
      )}
    >
      {(hasChildren && (
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="flex w-full flex-col"
        >
          <Collapsible.Trigger className="cursor-pointer flex items-center w-full text-foreground">
            <IconCaretRightFilled
              size={16}
              className={cn(
                isOpen && 'rotate-90',
                'transition-transform ease-linear duration-150',
              )}
            />
            <div className="text-xs font-semibold hover:text-primary flex justify-between items-center w-full transition-all ease-linear duration-300">
              <span className="truncate basis-4/5">
                {formattedIndex} - {title}
              </span>
              <span className="text-xs font-semibold text-accent-foreground pr-[7px]">
                {loading ? <Skeleton className="w-3 h-3" /> : usersTotalCount}
              </span>
            </div>
          </Collapsible.Trigger>
          <Collapsible.Content
            className={cn(
              'pl-6 peer data-[state=open]:py-3 py-0 flex gap-3 flex-col',
            )}
          >
            {childNodes?.map((child, childIndex) => (
              <ExpandableNode
                key={child._id}
                data={child}
                index={childIndex}
                list={list}
                parentIndex={formattedIndex}
                queryKey={'departmentId'}
              />
            ))}
          </Collapsible.Content>
        </Collapsible>
      )) || (
        <div className="w-full">
          <RadioGroup.Item id={_id} value={_id} className="sr-only peer" />
          <label
            htmlFor={_id}
            className={cn(
              'text-foreground w-full flex justify-between items-center cursor-pointer hover:text-primary peer-has-[[data-state=checked]]:text-primary text-sm leading-none font-semibold after:absolute after:inset-0',
            )}
          >
            <span className="truncate w-4/5">
              {formattedIndex} - {title}
            </span>
            <span className="text-xs font-semibold text-accent-foreground">
              {loading ? <Skeleton className="w-3 h-3" /> : usersTotalCount}
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
