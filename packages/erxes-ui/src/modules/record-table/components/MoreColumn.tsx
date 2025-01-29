import { MoreHorizontalIcon } from 'lucide-react';
import { CustomerFieldEditLoadingAtom } from 'erxes-ui/modules/record-table/states/CustomerFieldEditLoadingState';
import { Spinner } from 'erxes-ui/components';
import { useRecoilValue } from 'recoil';

const MoreColumnHeader = () => {
  const isLoading = useRecoilValue(CustomerFieldEditLoadingAtom);

  return (
    <div className="flex items-center justify-center">
      {isLoading && <Spinner size="small" />}
    </div>
  );
};

export const moreColumn = {
  accessorKey: 'more',
  id: 'more',
  size: 33,
  header: MoreColumnHeader,
  cell: () => {
    return (
      <div className="flex items-center justify-center">
        <MoreHorizontalIcon className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  },
};
