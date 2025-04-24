import ChooseCategoryPage from './choose-category';
import Ecommerce from './ecommerce';
import Restaurant from './restaurant';
import { PosCreateTabContent, PosDetailLayout } from './pos-create-layout';
import EcommercePaymentsForm from "./ecommerce-payment";
import RestaurantPaymentsForm from "./restaurant-payment";
import { posCategoryAtom } from "../states/posCategory";
import { useAtom } from "jotai";
import PermissionForm from "./permission";
import ProductServiceForm from "./product";
import Appearance from "./appearance";
import ScreenConfigForm from "./screen-config";
import EbarimtConfigForm from "./ebarimt-config";
import DeliveryConfigForm from "./delievery";
import SyncCardForm from "./sync";
import FinanceConfigForm from "./finance";
  
export const PosDetail = () => {
  const [posCategory] = useAtom(posCategoryAtom)
  const getCategorySpecificComponent = () => {
    if (posCategory === "ecommerce") {
      return <Ecommerce />;
    } else if (posCategory === "restaurant") {
      return <Restaurant />;
    } else {
      return null;
    }
  };
  const getCategorySpecific = () => {
    if (posCategory === "ecommerce") {
      return <EcommercePaymentsForm />;
    } else if (posCategory === "restaurant") {
      return <RestaurantPaymentsForm />;
    } else {
      return null;
    }
  };
  
  return (
    <PosDetailLayout>
      <PosCreateTabContent value="overview">
        <ChooseCategoryPage/>
      </PosCreateTabContent>
      <PosCreateTabContent value="properties">
        <div>
          {getCategorySpecificComponent()}
        </div>
      </PosCreateTabContent>
      <PosCreateTabContent value="payments">
        <div>
          {getCategorySpecific()}
        </div>
      </PosCreateTabContent>
      <PosCreateTabContent value="permission">
        <PermissionForm/>
      </PosCreateTabContent>
      <PosCreateTabContent value="product">
        <ProductServiceForm/>
      </PosCreateTabContent>
      <PosCreateTabContent value="appearance">
        <Appearance/>
      </PosCreateTabContent>
      <PosCreateTabContent value="screen">
        <ScreenConfigForm/>
      </PosCreateTabContent>
      <PosCreateTabContent value="ebarimt">
        <EbarimtConfigForm/>
      </PosCreateTabContent>
      <PosCreateTabContent value="finance">
       <FinanceConfigForm/>
      </PosCreateTabContent>
      <PosCreateTabContent value="delivery">
        <DeliveryConfigForm/>
      </PosCreateTabContent>
      <PosCreateTabContent value="sync">
        <SyncCardForm/>
      </PosCreateTabContent>
    </PosDetailLayout>
  );
};