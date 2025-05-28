import { useAtom } from 'jotai';
import { posCategoryAtom } from '../../states/posCategory';
import { PosCreateTabContent, PosDetailLayout } from './pos-create-layout';

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
  combineFormData,
  FormStepData,
} from '../formSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSubmitPosForm } from '~/modules/hooks/usePosAdd';


export const PosDetail = () => {
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
      adminIds: ["WQ3tsgnDdDu3jhbQj"],
      cashierIds: ["WQ3tsgnDdDu3jhbQj"],
      permissionConfig: {},
    }
  });

  // Form for basic info step
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

  // Form for permission step
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
      adminIds: ["WQ3tsgnDdDu3jhbQj"],
      cashierIds: ["WQ3tsgnDdDu3jhbQj"],
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
      // Capture current form data from all forms
      const currentBasicInfo = basicInfoForm.getValues();
      const currentPermission = permissionForm.getValues();
      
      // Update formStepData with current form values
      const finalFormStepData = {
        ...formStepData,
        basicInfo: currentBasicInfo,
        permission: {
          ...currentPermission,
          // Ensure adminIds and cashierIds are populated
          adminIds: currentPermission.adminTeamMember ? [currentPermission.adminTeamMember] : [],
          cashierIds: currentPermission.cashierTeamMember ? [currentPermission.cashierTeamMember] : [],
        },
      };
      
      console.log('Current formStepData:', finalFormStepData);
      
      // Submit the form data using the custom hook
      const result = await submitForm(finalFormStepData);
      
      if (result.data) {
        console.log('POS created successfully:', result.data.posAdd);
        // Handle success (e.g., redirect, show success message, etc.)
        // Example: navigate('/pos-list') or showSuccessToast()
      }
      
      // Update the state for consistency
      setFormStepData(finalFormStepData);
      
    } catch (error) {
      console.error('Failed to create POS:', error);
      // Handle error (e.g., show error message)
      // Example: showErrorToast('Failed to create POS')
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
    <PosDetailLayout
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
          <POSSlotsManager />
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
    </PosDetailLayout>
  );
};