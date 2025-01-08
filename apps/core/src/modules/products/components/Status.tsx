import { Switch } from 'erxes-ui/components';
import { CellContext } from '@tanstack/react-table';
import { ProductT } from '@/products/types/productTypes';

const StatusCell = (info: CellContext<ProductT, any>) => {
  return (
    <div>
      <Switch checked={info.getValue() === 'active'} />
      <span className="text-[13px] text-muted-foreground">
        {info.getValue() === 'active' ? 'Active' : 'Inactive'}
      </span>
    </div>
  );
};

export default StatusCell;
