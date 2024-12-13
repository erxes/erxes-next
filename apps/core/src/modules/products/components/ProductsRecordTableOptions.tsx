import { NestedDropdownMenu } from 'erxes-ui/components';
import { ProductsRecordTableOptionsContent } from './ProductsRecordTableOptionsContent';
export const ProductsRecordTableOptions = () => {
  return (
    <NestedDropdownMenu>
      <ProductsRecordTableOptionsContent></ProductsRecordTableOptionsContent>
    </NestedDropdownMenu>
  );
};
