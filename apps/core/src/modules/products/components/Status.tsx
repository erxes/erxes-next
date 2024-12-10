import { Switch } from 'erxes-ui/components';
import { CategoryCellWrapper } from './CategoryCell';
import { CellContext } from '@tanstack/react-table';
import { ProductT } from '@/products/types/productTypes';

const StatusCell = (info: CellContext<ProductT, any>) => {
  return (
    <CategoryCellWrapper>
      <Switch checked={info.getValue() === 'active'} />
      {info.getValue() === 'active' ? 'Active' : 'Inactive'}
    </CategoryCellWrapper>
  );
};

export default StatusCell;
