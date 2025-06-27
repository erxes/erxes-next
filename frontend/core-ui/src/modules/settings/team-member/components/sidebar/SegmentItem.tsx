import { RadioGroup, Skeleton } from 'erxes-ui';
import { TSegment, useSegment } from '../../hooks/useSegment';
import { CollapsibleItemWrapper } from './CollapsibleItemWrapper';

export function SegmentItem() {
  const { segments, loading } = useSegment();

  if (loading) {
    return (
      <div className="py-4 px-2">
        <Skeleton className="w-full h-32" />
      </div>
    );
  }

  return (
    <CollapsibleItemWrapper label="Segments" open>
      <RadioGroup className="pl-9">
        {segments &&
          segments.map(({ _id, name }: TSegment) => (
            <div
              key={_id}
              className="has-[[data-state=checked]]:bg-primary/10 relative hover:bg-primary/10 flex cursor-pointer gap-3 rounded-md px-2 py-[7.5px] transition-[color,box-shadow] outline-none"
            >
              <RadioGroup.Item id={_id} value={_id} className="sr-only peer" />
              <label
                htmlFor={_id}
                className="text-foreground cursor-pointer peer-has-[[data-state=checked]]:text-primary text-sm leading-none font-semibold after:absolute after:inset-0"
              >
                {name}
              </label>
            </div>
          ))}
      </RadioGroup>
    </CollapsibleItemWrapper>
  );
}
