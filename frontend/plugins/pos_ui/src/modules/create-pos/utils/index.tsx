import type { JSX } from 'react/jsx-runtime';
import { CustomNode } from '~/modules/slot/types';
import POSSlotsManager from '~/modules/slot/components/slot';
import ChooseCategoryPage from '../components/category/choose-category';
import { EcommerceForm } from '../components/general/ecommerce';
import { RestaurantForm } from '../components/general/restaurant';
import EcommercePaymentsForm from '../components/payments/ecommerce-payment';
import RestaurantPaymentsForm from '../components/payments/restaurant-payment';
import PermissionForm from '../components/permission/permission';
import ProductForm from '../components/product/product';
import AppearanceForm from '../components/appearance/appearance';
import ScreenConfigForm from '../components/config/screen-config';
import EbarimtConfigForm from '../components/config/ebarimt-config';
import FinanceConfigForm from '../components/finance/finance';
import DeliveryConfigForm from '../components/delivery/delivery';
import SyncCardForm from '../components/sync/sync';
import { UseFormReturn } from 'react-hook-form';
import { BasicInfoFormValues, PermissionFormValues, ProductFormValues, PaymentFormValues } from '../components/formSchema';
import { TabConfig } from '../types/pos';

interface GetPosCreateTabsProps {
  posCategory: 'ecommerce' | 'restaurant';
  forms: {
    basicInfo: UseFormReturn<BasicInfoFormValues>;
    permission: UseFormReturn<PermissionFormValues>;
    product: UseFormReturn<ProductFormValues>;
    payment: UseFormReturn<PaymentFormValues>;
  };
  handlers: {
    handleNodesUpdate: (nodes: CustomNode[]) => void;
  };
  data: {
    createdPosId: string | null;
    slotNodes: CustomNode[];
  };
}

const getCategoryComponent = (
  posCategory: string,
  ecommerceComponent: JSX.Element,
  restaurantComponent: JSX.Element,
) => {
  if (posCategory === 'ecommerce') return ecommerceComponent;
  if (posCategory === 'restaurant') return restaurantComponent;
  return null;
};

export const getPosCreateTabs = ({
  posCategory,
  forms,
  handlers,
  data,
}: GetPosCreateTabsProps): TabConfig[] => {
  const baseTabs: TabConfig[] = [
    {
      value: 'overview',
      component: <ChooseCategoryPage />,
    },
    {
      value: 'properties',
      component: getCategoryComponent(
        posCategory,
        <EcommerceForm form={forms.basicInfo} />,
        <RestaurantForm form={forms.basicInfo} />,
      ) || <div>Please select a category first</div>,
    },
    {
      value: 'payments',
      component: getCategoryComponent(
        posCategory,
        <EcommercePaymentsForm
          form={forms.payment}
        />,
        <RestaurantPaymentsForm />,
      ) || <div>Please select a category first</div>,
    },
    {
      value: 'permission',
      component: (
        <PermissionForm
          form={forms.permission}
        />
      ),
    },
    {
      value: 'product',
      component: <ProductForm form={forms.product} />,
    },
    {
      value: 'appearance',
      component: <AppearanceForm />,
    },
    {
      value: 'screen',
      component: <ScreenConfigForm />,
    },
    {
      value: 'ebarimt',
      component: <EbarimtConfigForm />,
    },
    {
      value: 'finance',
      component: <FinanceConfigForm />,
    },
    {
      value: 'delivery',
      component: <DeliveryConfigForm />,
    },
    {
      value: 'sync',
      component: <SyncCardForm />,
    },
  ];

  if (posCategory === 'restaurant') {
    const slotTab: TabConfig = {
      value: 'slot',
      component: (
        <POSSlotsManager
          posId={data.createdPosId || ''}
          initialNodes={data.slotNodes}
          onNodesChange={handlers.handleNodesUpdate}
          isCreating={true}
        />
      ),
    };

    const propertiesIndex = baseTabs.findIndex(tab => tab.value === 'properties');
    baseTabs.splice(propertiesIndex + 1, 0, slotTab);
  }

  return baseTabs;
};