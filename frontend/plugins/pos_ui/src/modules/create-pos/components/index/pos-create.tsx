import { useAtom } from 'jotai';
import { posCategoryAtom } from '../../states/posCategory';
import { PosCreateTabContent, PosCreateLayout } from './pos-create-layout';

import ChooseCategoryPage from '../category/choose-category';
import EcommercePaymentsForm from '../payments/ecommerce-payment';
import RestaurantPaymentsForm from '../payments/restaurant-payment';
import PermissionForm from '../permission/permission';
import ProductServiceForm from '../product/product';
import AppearanceForm from '../appearance/appearance';
import ScreenConfigForm from '../config/screen-config';
import EbarimtConfigForm from '../config/ebarimt-config';
import DeliveryConfigForm from '../delievery/delievery';
import SyncCardForm from '../sync/sync';
import FinanceConfigForm from '../finance/finance';
import { JSX } from 'react/jsx-runtime';
import POSSlotsManager from '~/modules/slot/components/slot';
import { EcommerceForm } from '../general/ecommerce';
import { useForm } from 'react-hook-form';
import { RestaurantForm } from '../general/restaurant';
import { useState } from 'react';
import {
  BasicInfoFormValues,
  PermissionFormValues,
  basicInfoSchema,
  permissionSchema,
  FormStepData,
} from '../formSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSubmitPosForm } from '~/modules/hooks/usePosAdd';


export const PosCreate = () => {
  const [posCategory] = useAtom(posCategoryAtom);
  const { submitForm, loading, error } = useSubmitPosForm();
  
  const [formStepData, setFormStepData] = useState<FormStepData>({
    basicInfo: {
      name: '',
      description: '',
      allowTypes: [],
      scopeBrandIds: [],
      allowBranchIds: [],
    },
    permission: {
      adminTeamMember: '',
      adminPrintTempBill: false,
      adminDirectSales: false,
      adminDirectDiscountLimit: '',
      cashierTeamMember: '',
      cashierPrintTempBill: false,
      cashierDirectSales: false,
      cashierDirectDiscountLimit: '',
      adminIds: [],
      cashierIds: [],
      permissionConfig: {},
    }
  });

  const basicInfoForm = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: '',
      description: '',
      allowTypes: [],
      scopeBrandIds: [],
      allowBranchIds: [],
    },
  });

  const permissionForm = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      adminTeamMember: '',
      adminPrintTempBill: false,
      adminDirectSales: false,
      adminDirectDiscountLimit: '',
      cashierTeamMember: '',
      cashierPrintTempBill: false,
      cashierDirectSales: false,
      cashierDirectDiscountLimit: '',
      adminIds: [],
      cashierIds: [],
      permissionConfig: {},
    },
  });

  const handleBasicInfoSubmit = (data: BasicInfoFormValues) => {
    console.log('Basic info submitted:', data);
    setFormStepData((prev) => ({
      ...prev,
      basicInfo: data,
    }));
  };

  const handlePermissionSubmit = (data: PermissionFormValues) => {
    console.log('Permission data submitted:', data);
    setFormStepData((prev) => ({
      ...prev,
      permission: data,
    }));
  };

  const handleFinalSubmit = async () => {
    try {
      const currentBasicInfo = basicInfoForm.getValues();
      const currentPermission = permissionForm.getValues();
      
      const finalFormStepData = {
        ...formStepData,
        basicInfo: currentBasicInfo,
        permission: {
          ...currentPermission,
          adminIds: currentPermission.adminTeamMember ? [currentPermission.adminTeamMember] : [],
          cashierIds: currentPermission.cashierTeamMember ? [currentPermission.cashierTeamMember] : [],
        },
      };
      const result = await submitForm(finalFormStepData);

      setFormStepData(finalFormStepData);
      
    } catch (error) {
      console.error('Failed to create POS:', error);
    }
  };

  const getCategoryComponent = (
    ecommerceComponent: JSX.Element,
    restaurantComponent: JSX.Element,
  ) => {
    if (posCategory === 'ecommerce') {
      return ecommerceComponent;
    } else if (posCategory === 'restaurant') {
      return restaurantComponent;
    }
    return null;
  };

  return (
    <PosCreateLayout
      form={basicInfoForm}
      onFormSubmit={handleBasicInfoSubmit}
      onFinalSubmit={handleFinalSubmit}
      loading={loading}
      error={error}
    >
      <PosCreateTabContent value="overview">
        <ChooseCategoryPage />
      </PosCreateTabContent>

      <PosCreateTabContent value="properties">
        {getCategoryComponent(
          <EcommerceForm form={basicInfoForm} />,
          <RestaurantForm form={basicInfoForm} />,
        )}
      </PosCreateTabContent>

      {posCategory === 'restaurant' && (
        <PosCreateTabContent value="slot">
          <POSSlotsManager posId={''} />
        </PosCreateTabContent>
      )}

      <PosCreateTabContent value="payments">
        {getCategoryComponent(
          <EcommercePaymentsForm />,
          <RestaurantPaymentsForm />,
        )}
      </PosCreateTabContent>

      <PosCreateTabContent value="permission">
        <PermissionForm 
          form={permissionForm}
          onFormSubmit={handlePermissionSubmit}
        />
      </PosCreateTabContent>

      <PosCreateTabContent value="product">
        <ProductServiceForm />
      </PosCreateTabContent>

      <PosCreateTabContent value="appearance">
        <AppearanceForm />
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
    </PosCreateLayout>
  );
};