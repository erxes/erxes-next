import { Button } from 'erxes-ui/components';

import { Avatar } from 'erxes-ui/components';
import { CellContext } from '@tanstack/react-table';
import { ProductT } from '@/products/types/productTypes';
import { CategoryCellWrapper } from './CategoryCell';
import { isUndefinedOrNull } from 'erxes-ui/utils';

export const VendorCell = (info: CellContext<ProductT, any>) => {
  if (isUndefinedOrNull(info.getValue())) {
    return null;
  }

  return (
    <CategoryCellWrapper>
      <Button size="sm" variant="secondary">
        <Avatar.Root>
          <Avatar.Image />
          <Avatar.Fallback className="bg-blue-100 text-blue-800">
            {((info.getValue() || '') as string).charAt(0)}
          </Avatar.Fallback>
        </Avatar.Root>
        {info.getValue() as string}
      </Button>
    </CategoryCellWrapper>
  );
};
