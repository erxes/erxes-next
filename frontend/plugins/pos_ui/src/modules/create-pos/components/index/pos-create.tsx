'use client';

import { useAtom } from 'jotai';
import { posCategoryAtom } from '../../states/posCategory';
import { PosCreateTabContent, PosCreateLayout } from './pos-create-layout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSubmitPosForm } from '~/modules/hooks/usePosAdd';
import { useUpdatePosSlots } from '~/modules/hooks/useSlotAdd';
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
import { CustomNode } from '~/modules/slot/types';
import POSSlotsManager from '~/modules/slot/components/slot';
import { useToast } from 'erxes-ui/hooks';

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
import { EcommerceForm } from '../general/ecommerce';
import ProductForm from '../product/product';
import { RestaurantForm } from '../general/restaurant';

export const PosCreate = () => {
  const [posCategory] = useAtom(posCategoryAtom);
  const {
    submitForm,
    loading: posLoading,
    error: posError,
  } = useSubmitPosForm();
  const {
    updatePosSlots,
    loading: slotLoading,
    error: slotError,
  } = useUpdatePosSlots();
  const [createdPosId, setCreatedPosId] = useState<string | null>(null);
  const [slotNodes, setSlotNodes] = useState<CustomNode[]>([]);
  const { toast } = useToast();

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

  const handleSaveSlots = async (posId: string) => {
    if (!posId || slotNodes.length === 0) {
      return;
    }

    try {
      const slotsData = slotNodes.map((node) => ({
        code: node.data.code,
        name: node.data.label,
        posId: posId,
        option: {
          width: node.data.width,
          height: node.data.height,
          top: node.data.positionY,
          left: node.data.positionX,
          rotateAngle: node.data.rotateAngle,
          borderRadius: node.data.rounded ? 8 : 0,
          color: node.data.color,
          zIndex: node.data.zIndex,
          isShape: false,
        },
      }));

      await updatePosSlots({
        variables: {
          posId: posId,
          slots: slotsData,
        },
      });

      toast({
        title: 'Slots saved successfully',
        description: `Saved ${slotsData.length} slots`,
      });
    } catch (error) {
      console.error('Failed to save slots:', error);
      toast({
        title: 'Failed to save slots',
        description: 'Please try again later',
        variant: 'destructive',
      });
      throw error;
    }
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
        payment: currentPayment,
      };

      const result = await submitForm(finalFormStepData);

      if (result?.data?.posAdd?._id) {
        const posId = result.data.posAdd._id;
        setCreatedPosId(posId);

        if (posCategory === 'restaurant' && slotNodes.length > 0) {
          await handleSaveSlots(posId);
        }

        toast({
          title: 'POS created successfully',
          description: 'POS has been created',
        });
      }

      setFormStepData(finalFormStepData);
    } catch (error) {
      console.error('Failed to create POS:', error);
      toast({
        title: 'Failed to create POS',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const handleNodesUpdate = (nodes: CustomNode[]) => {
    setSlotNodes(nodes);
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
      onSaveSlots={() => handleSaveSlots(createdPosId || '')}
      loading={posLoading || slotLoading}
      error={posError || slotError}
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
          <POSSlotsManager
            posId={createdPosId || ''}
            initialNodes={slotNodes}
            onNodesChange={handleNodesUpdate}
            isCreating={true}
          />
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
