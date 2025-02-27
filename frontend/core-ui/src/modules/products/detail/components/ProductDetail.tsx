import { ProductDetailLayout, ProductDetailTabContent 
 } from "./ProductDetailLayout";
import { Separator } from 'erxes-ui/components';
import { ProductGeneral } from "./ProductGeneral";

export const ProductDetail = () => {
    return (
      <ProductDetailLayout>
        <Separator />
        <ProductDetailTabContent value="overview">
          <ProductGeneral />
        </ProductDetailTabContent>
        <ProductDetailTabContent value="properties">
          hehhe
          {/* <ContactProperties /> */}
        </ProductDetailTabContent>
      </ProductDetailLayout>
    );
  };
  