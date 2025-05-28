import { useAtom } from 'jotai';
import { useState, useEffect } from 'react';
import { usePosDetail } from '../hooks/useDetail';
import { posCategoryAtom } from '~/modules/create-pos/states/posCategory';
import { usePosEdit } from '~/modules/hooks/usePosEdit';
import {
  BasicInfoFormValues,
  basicInfoSchema,
  FormStepData,
  PermissionFormValues,
  permissionSchema,
} from '~/modules/create-pos/components/formSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PosEditLayout, PosEditTabContent } from './posDetailLayout';
import ChooseCategoryPage from '~/modules/create-pos/components/category/choose-category';
import { EcommerceForm } from '~/modules/create-pos/components/general/ecommerce';
import { RestaurantForm } from '~/modules/create-pos/components/general/restaurant';
import POSSlotsManager from '~/modules/slot/components/slot';
import EcommercePaymentsForm from '~/modules/create-pos/components/payments/ecommerce-payment';
import RestaurantPaymentsForm from '~/modules/create-pos/components/payments/restaurant-payment';
import PermissionForm from '~/modules/create-pos/components/permission/permission';
import ProductServiceForm from '~/modules/create-pos/components/product/product';
import AppearanceForm from '~/modules/create-pos/components/appearance/appearance';
import ScreenConfigForm from '~/modules/create-pos/components/config/screen-config';
import EbarimtConfigForm from '~/modules/create-pos/components/config/ebarimt-config';
import FinanceConfigForm from '~/modules/create-pos/components/finance/finance';
import DeliveryConfigForm from '~/modules/create-pos/components/delievery/delievery';
import SyncCardForm from '~/modules/create-pos/components/sync/sync';

export const PosEdit = () => {
  const { posDetail, loading: posLoading, error: posError } = usePosDetail();
  const [posCategory, setPosCategory] = useAtom(posCategoryAtom);
  const { posEdit, loading: editLoading } = usePosEdit();

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
    },
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

  useEffect(() => {
    if (posDetail) {
      if (posDetail.category) {
        setPosCategory(posDetail.category);
      }

      basicInfoForm.reset({
        name: posDetail.name || '',
        description: posDetail.description || '',
        allowTypes: posDetail.allowTypes || [],
        scopeBrandIds: posDetail.scopeBrandIds || [],
        allowBranchIds: posDetail.allowBranchIds || [],
      });

      permissionForm.reset({
        adminTeamMember: posDetail.adminTeamMember || '',
        adminPrintTempBill: posDetail.adminPrintTempBill || false,
        adminDirectSales: posDetail.adminDirectSales || false,
        adminDirectDiscountLimit: posDetail.adminDirectDiscountLimit || '',
        cashierTeamMember: posDetail.cashierTeamMember || '',
        cashierPrintTempBill: posDetail.cashierPrintTempBill || false,
        cashierDirectSales: posDetail.cashierDirectSales || false,
        cashierDirectDiscountLimit: posDetail.cashierDirectDiscountLimit || '',
        adminIds: posDetail.adminIds || [],
        cashierIds: posDetail.cashierIds || [],
        permissionConfig: posDetail.permissionConfig || {},
      });

      setFormStepData({
        basicInfo: {
          name: posDetail.name || '',
          description: posDetail.description || '',
          allowTypes: posDetail.allowTypes || [],
          scopeBrandIds: posDetail.scopeBrandIds || [],
          allowBranchIds: posDetail.allowBranchIds || [],
        },
        permission: {
          adminTeamMember: posDetail.adminTeamMember || '',
          adminPrintTempBill: posDetail.adminPrintTempBill || false,
          adminDirectSales: posDetail.adminDirectSales || false,
          adminDirectDiscountLimit: posDetail.adminDirectDiscountLimit || '',
          cashierTeamMember: posDetail.cashierTeamMember || '',
          cashierPrintTempBill: posDetail.cashierPrintTempBill || false,
          cashierDirectSales: posDetail.cashierDirectSales || false,
          cashierDirectDiscountLimit:
            posDetail.cashierDirectDiscountLimit || '',
          adminIds: posDetail.adminIds || [],
          cashierIds: posDetail.cashierIds || [],
          permissionConfig: posDetail.permissionConfig || {},
        },
      });
    }
  }, [posDetail, basicInfoForm, permissionForm, setPosCategory]);

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

  const handleFinalSubmit = async () => {
    try {
      const currentBasicInfo = basicInfoForm.getValues();
      const currentPermission = permissionForm.getValues();

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
      };

      setFormStepData(finalFormStepData);

      await posEdit(
        {
          variables: {
            _id: posDetail._id,
            ...finalFormStepData,
          },
        },
        [
          'name',
          'description',
          'allowTypes',
          'scopeBrandIds',
          'allowBranchIds',
          'adminTeamMember',
          'adminPrintTempBill',
          'adminDirectSales',
          'adminDirectDiscountLimit',
          'cashierTeamMember',
          'cashierPrintTempBill',
          'cashierDirectSales',
          'cashierDirectDiscountLimit',
          'adminIds',
          'cashierIds',
          'permissionConfig',
        ],
      );
    } catch (error) {
      console.error('Failed to update POS:', error);
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

  if (posLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading POS details...</p>
        </div>
      </div>
    );
  }

  if (posError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-600">
          <p>Error loading POS details: {posError.message}</p>
        </div>
      </div>
    );
  }

  if (!posDetail) {
    return (
      <div>
      </div>
    );
  }

  return (
    <PosEditLayout
      form={basicInfoForm}
      onFormSubmit={handleBasicInfoSubmit}
      onFinalSubmit={handleFinalSubmit}
      loading={editLoading}
      error={posError}
      posDetail={posDetail}
    >
      <PosEditTabContent value="overview">
        <ChooseCategoryPage />
      </PosEditTabContent>

      <PosEditTabContent value="properties">
        {getCategoryComponent(
          <EcommerceForm form={basicInfoForm} posDetail={posDetail} />,
          <RestaurantForm form={basicInfoForm} posDetail={posDetail} />,
        )}
      </PosEditTabContent>

      {posCategory === 'restaurant' && (
        <PosEditTabContent value="slot">
          <POSSlotsManager posId={posDetail._id} />
        </PosEditTabContent>
      )}

      <PosEditTabContent value="payments">
        {getCategoryComponent(
          <EcommercePaymentsForm posDetail={posDetail} />,
          <RestaurantPaymentsForm posDetail={posDetail} />,
        )}
      </PosEditTabContent>

      <PosEditTabContent value="permission">
        <PermissionForm
          form={permissionForm}
          onFormSubmit={handlePermissionSubmit}
          posDetail={posDetail}
        />
      </PosEditTabContent>

      <PosEditTabContent value="product">
        <ProductServiceForm posDetail={posDetail} />
      </PosEditTabContent>

      <PosEditTabContent value="appearance">
        <AppearanceForm posDetail={posDetail} />
      </PosEditTabContent>

      <PosEditTabContent value="screen">
        <ScreenConfigForm posDetail={posDetail} />
      </PosEditTabContent>

      <PosEditTabContent value="ebarimt">
        <EbarimtConfigForm posDetail={posDetail} />
      </PosEditTabContent>

      <PosEditTabContent value="finance">
        <FinanceConfigForm posDetail={posDetail} />
      </PosEditTabContent>

      <PosEditTabContent value="delivery">
        <DeliveryConfigForm posDetail={posDetail} />
      </PosEditTabContent>

      <PosEditTabContent value="sync">
        <SyncCardForm posDetail={posDetail} />
      </PosEditTabContent>
    </PosEditLayout>
  );
};
