'use client';

import { useAtom } from 'jotai';
import { posCategoryAtom } from '../../states/posCategory';
import { PosCreateTabContent, PosCreateLayout } from './pos-create-layout';

import ChooseCategoryPage from '../category/choose-category';
import EcommercePaymentsForm from '../payments/ecommerce-payment';
import RestaurantPaymentsForm from '../payments/restaurant-payment';
import PermissionForm from '../permission/permission';
import AppearanceForm from '../appearance/appearance';
import ScreenConfigForm from '../config/screen-config';
import EbarimtConfigForm from '../config/ebarimt-config';
import DeliveryConfigForm from '../delivery/delivery';
import SyncCardForm from '../sync/sync';
import FinanceConfigForm from '../finance/finance';
import type { JSX } from 'react/jsx-runtime';
import POSSlotsManager from '~/modules/slot/components/slot';
import { EcommerceForm } from '../general/ecommerce';
import { useForm } from 'react-hook-form';
import { RestaurantForm } from '../general/restaurant';
import { useState } from 'react';
import {
  type BasicInfoFormValues,
  type PermissionFormValues,
  type ProductFormValues,
  type PaymentFormValues,
  basicInfoSchema,
  permissionSchema,
  productSchema,
  paymentSchema,
  type FormStepData,
} from '../formSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSubmitPosForm } from '~/modules/hooks/usePosAdd';
import ProductForm from '../product/product';

export const PosCreate = () => {
  const [posCategory] = useAtom(posCategoryAtom);
  const { submitForm, loading, error } = useSubmitPosForm();

  const [formStepData, setFormStepData] = useState<FormStepData>({
    basicInfo: {
      name: '',
      description: '',
      allowTypes: [],
      scopeBrandIds: [],
      branchId: '',
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
    },
    product: {
      productDetails: [],
      catProdMappings: [],
      initialCategoryIds: [],
      kioskExcludeCategoryIds: [],
      kioskExcludeProductIds: [],
      checkExcludeCategoryIds: [],
    },
    payment: {
      paymentIds: [],
      paymentTypes: [],
    },
  });

  const basicInfoForm = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: '',
      description: '',
      allowTypes: [],
      scopeBrandIds: [],
      branchId: '',
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

  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productDetails: [],
      catProdMappings: [],
      initialCategoryIds: [],
      kioskExcludeCategoryIds: [],
      kioskExcludeProductIds: [],
      checkExcludeCategoryIds: [],
    },
  });

  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentIds: [],
      paymentTypes: [],
    },
  });

  const handleBasicInfoSubmit = (data: BasicInfoFormValues) => {
    setFormStepData((prev) => ({
      ...prev,
      basicInfo: data,
    }));
  };

  const handlePermissionSubmit = (data: PermissionFormValues) => {
    setFormStepData((prev) => ({
      ...prev,
      permission: data,
    }));
  };

  const handlePaymentSubmit = (data: PaymentFormValues) => {
    setFormStepData((prev) => ({
      ...prev,
      payment: data,
    }));
    console.log('Payment data updated:', data);
  };

  const handleFinalSubmit = async () => {
    try {
      const currentBasicInfo = basicInfoForm.getValues();
      const currentPermission = permissionForm.getValues();
      const currentProduct = productForm.getValues();
      const currentPayment = paymentForm.getValues();

      const finalFormStepData = {
        ...formStepData,
        basicInfo: currentBasicInfo,
        permission: {
          ...currentPermission,
          adminIds: currentPermission.adminTeamMember
            ? [currentPermission.adminTeamMember]
            : [],
          cashierIds: currentPermission.cashierTeamMember
            ? [currentPermission.cashierTeamMember]
            : [],
        },
        product: currentProduct,
        payment: currentPayment, // This will include the full payment structure
      };

      console.log('Final form data being submitted:', finalFormStepData);

      const result = await submitForm(finalFormStepData);
      console.log('POS created successfully:', result);

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
          <EcommercePaymentsForm
            form={paymentForm}
            onFormSubmit={handlePaymentSubmit}
          />,
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
        <ProductForm form={productForm} />
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
