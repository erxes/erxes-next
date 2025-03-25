import { RadioGroup, Skeleton } from 'erxes-ui';
import { TUnit, useUnit } from '../../hooks/useUnit';
import { CollapsibleItemWrapper } from './CollapsibleItemWrapper';
import { useCountByOptions } from '../../hooks/useCountByOptions';

export function UnitItem() {
  const { units, loading } = useUnit();

  if (loading) {
    return (
      <div className="py-4 px-2">
        <Skeleton className="w-full h-32" />
      </div>
    );
  }

  return (
    <CollapsibleItemWrapper label="Unit" open>
      <RadioGroup className="pl-9">
        {units &&
          units.map((unit: TUnit, index: number) => (
            <UnitRadioItem {...unit} index={index} />
          ))}
      </RadioGroup>
    </CollapsibleItemWrapper>
  );
}

const UnitRadioItem = ({ _id, title, index }: TUnit & { index: number }) => {
  const { usersTotalCount, loading } = useCountByOptions({
    variables: {
      unitId: _id,
    },
  });
  return (
    <div
      key={_id}
      className="has-[[data-state=checked]]:bg-primary/10 relative hover:bg-primary/10 flex cursor-pointer gap-3 rounded-md px-2 py-[7.5px] transition-[color,box-shadow] outline-none"
    >
      <RadioGroup.Item id={_id} value={_id} className="sr-only peer" />
      <label
        htmlFor={_id}
        className="text-foreground w-full flex justify-between cursor-pointer peer-has-[[data-state=checked]]:text-primary text-sm leading-none font-semibold after:absolute after:inset-0"
      >
        <span className="truncate w-[200px]">
          {index} - {title}{' '}
        </span>
        <span className="text-xs font-semibold text-accent-foreground">
          {(loading && <Skeleton className="w-3 h-3" />) || usersTotalCount}
        </span>
      </label>
    </div>
  );
};
