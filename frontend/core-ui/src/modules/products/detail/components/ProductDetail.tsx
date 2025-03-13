import { ProductDetailLayout, ProductDetailTabContent 
 } from "./ProductDetailLayout";
import { Separator } from 'erxes-ui/components';
import { ProductGeneral } from "./ProductGeneral";
import { ProductProperties } from "./ProductProperties";

export const ProductDetail = () => {
    return (
      <ProductDetailLayout>
        <Separator />
        <ProductDetailTabContent value="overview">
          <ProductGeneral />
        </ProductDetailTabContent>
        <ProductDetailTabContent value="properties">
          <ProductProperties />
        </ProductDetailTabContent>
      </ProductDetailLayout>
    );
  };
  