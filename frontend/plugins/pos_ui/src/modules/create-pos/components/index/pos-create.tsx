import { useAtom } from "jotai";
import { posCategoryAtom } from "../../states/posCategory";
import { PosCreateTabContent, PosDetailLayout } from './pos-create-layout';

import ChooseCategoryPage from '../category/choose-category';
import Ecommerce from '../general/ecommerce';
import Restaurant from '../general/restaurant';
import EcommercePaymentsForm from "../payments/ecommerce-payment";
import RestaurantPaymentsForm from "../payments/restaurant-payment";
import PermissionForm from "../permission/permission";
import ProductServiceForm from "../product/product";
import Appearance from "../appearance/appearance";
import ScreenConfigForm from "../config/screen-config";
import EbarimtConfigForm from "../config/ebarimt-config";
import DeliveryConfigForm from "../delievery/delievery";
import SyncCardForm from "../sync/sync";
import FinanceConfigForm from "../finance/finance";
import POSSlotsManagerWithProvider from '~/modules/slot/components/slot';
import { JSX } from "react/jsx-runtime";

export const PosDetail = () => {
  const [posCategory] = useAtom(posCategoryAtom);

  const getCategoryComponent = (ecommerceComponent: JSX.Element, restaurantComponent: JSX.Element) => {
    if (posCategory === "ecommerce") {
      return ecommerceComponent;
    } else if (posCategory === "restaurant") {
      return restaurantComponent;
    }
    return null;
  };

  return (
    <PosDetailLayout>
      <PosCreateTabContent value="overview">
        <ChooseCategoryPage />
      </PosCreateTabContent>
      
      <PosCreateTabContent value="properties">
        {getCategoryComponent(<Ecommerce />, <Restaurant />)}
      </PosCreateTabContent>
      
      {posCategory === "restaurant" && (
        <PosCreateTabContent value="slot">
          <POSSlotsManagerWithProvider />
        </PosCreateTabContent>
      )}
      
      <PosCreateTabContent value="payments">
        {getCategoryComponent(<EcommercePaymentsForm />, <RestaurantPaymentsForm />)}
      </PosCreateTabContent>
      
      <PosCreateTabContent value="permission">
        <PermissionForm />
      </PosCreateTabContent>
      
      <PosCreateTabContent value="product">
        <ProductServiceForm />
      </PosCreateTabContent>
      
      <PosCreateTabContent value="appearance">
        <Appearance />
      </PosCreateTabContent>
      
      <PosCreateTabContent value="screen">
        <ScreenConfigForm />
      </PosCreateTabContent>
      
      <PosCreateTabContent value="ebarimt">
        <EbarimtConfigForm />
      </PosCreateTabContent>
      
      <PosCreateTabContent value="finance">
        <FinanceConfigForm />
      </PosCreateTabContent>
      
      <PosCreateTabContent value="delivery">
        <DeliveryConfigForm />
      </PosCreateTabContent>
      
      <PosCreateTabContent value="sync">
        <SyncCardForm />
      </PosCreateTabContent>
    </PosDetailLayout>
  );
};