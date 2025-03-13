import { ProductDetailLayout, ProductDetailTabContent 
 } from "./ProductDetailLayout";
import { Separator } from 'erxes-ui/components';
import { ProductGeneral } from "./ProductGeneral";
import { ProductProperties } from "./ProductProperties";
import { useForm } from "react-hook-form";

export const ProductDetail = () => {
    const form = useForm();
    return (
      <ProductDetailLayout>
        <Separator />
        <ProductDetailTabContent value="overview">
          <ProductGeneral form={form} />
        </ProductDetailTabContent>
        <ProductDetailTabContent value="properties">
          <ProductProperties />
        </ProductDetailTabContent>
      </ProductDetailLayout>
    );
  };
  