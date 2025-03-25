import { RadioGroup, Skeleton } from 'erxes-ui';
import { TBranch, useBranch } from '../../hooks/useBranch';
import { CollapsibleItemWrapper } from './CollapsibleItemWrapper';
import { useCountByOptions } from '../../hooks/useCountByOptions';

export function BranchItem() {
  const { branches, loading } = useBranch({
    variables: {
      withoutUserFilter: true,
    },
  });

  if (loading) {
    return (
      <div className="py-4 px-2">
        <Skeleton className="w-full h-32" />
      </div>
    );
  }
  return (
    <CollapsibleItemWrapper label="Branch" open>
      <RadioGroup className="pl-9">
        {branches &&
          branches
            .filter(({ parentId }: TBranch) => parentId === null)
            .map((branch: TBranch, index: number) => (
              <BranchRadioItem key={branch._id} {...branch} index={index} />
            ))}
      </RadioGroup>
    </CollapsibleItemWrapper>
  );
}

const BranchRadioItem = ({
  _id,
  title,
  index,
}: TBranch & { index: number }) => {
  const { usersTotalCount, loading } = useCountByOptions({
    variables: {
      branchId: _id,
    },
  });
  const formattedIndex = String(index + 1).padStart(3, '0');
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
        <span className='basis-4/5 truncate'>
          {formattedIndex} - {title}{' '}
        </span>
        <span className="text-xs font-semibold text-accent-foreground basis-1/5 text-right">
          {(loading && <Skeleton className="w-3 h-3" />) || usersTotalCount}
        </span>
      </label>
    </div>
  );
};
