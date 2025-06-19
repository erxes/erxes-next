import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { BasicInfoFormValues, basicInfoSchema, FormStepData, PaymentFormValues, paymentSchema, PermissionFormValues, permissionSchema, ProductFormValues, productSchema } from '../components/formSchema';

const getDefaultFormStepData = (): FormStepData => ({
  basicInfo: {
    name: '',
    description: '',
    allowTypes: [],
    scopeBrandIds: [],
    branchId: '',
    departmentId: '',
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

export const usePosCreateForm = () => {
  const [formStepData, setFormStepData] = useState<FormStepData>(
    getDefaultFormStepData()
  );

  const basicInfoForm = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: formStepData.basicInfo,
  });

  const permissionForm = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: formStepData.permission,
  });

  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: formStepData.product,
  });

  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: formStepData.payment,
  });

  const forms = {
    basicInfo: basicInfoForm,
    permission: permissionForm,
    product: productForm,
    payment: paymentForm,
  };

  return {
    forms,
    formStepData,
    setFormStepData,
  };
};