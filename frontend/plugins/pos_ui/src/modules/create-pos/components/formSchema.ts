import { z } from 'zod';

const uiOptionsSchema = z.object({
  colors: z.object({
    bodyColor: z.string().default('#FFFFFF'),
    headerColor: z.string().default('#6569DF'),
    footerColor: z.string().default('#3CCC38'),
  }),
  logo: z.string().default(''),
  bgImage: z.string().default(''),
  favIcon: z.string().default(''),
  receiptIcon: z.string().default(''),
  kioskHeaderImage: z.string().default(''),
  mobileAppImage: z.string().default(''),
  qrCodeImage: z.string().default(''),
});

const productDetailSchema = z.object({
  productId: z.string(),
  categoryId: z.string().optional(),
  isRequired: z.boolean().default(false),
});

const catProdMappingSchema = z.object({
  categoryId: z.string(),
  productIds: z.array(z.string()).default([]),
});

// Updated to match your backend structure exactly
const paymentTypeSchema = z.object({
  _id: z.string().optional(), // Backend ID
  type: z.string(),
  title: z.string(),
  icon: z.string(),
  config: z.string(), // Keep as string for backend compatibility
});

export const posDetailSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  adminIds: z.array(z.string()).min(1, 'At least one admin is required'),
  cashierIds: z.array(z.string()).min(1, 'At least one cashier is required'),
  productDetails: z.array(productDetailSchema).default([]),
  paymentIds: z.array(z.string()).default([]),
  paymentTypes: z.array(paymentTypeSchema).default([]),
  uiOptions: uiOptionsSchema.default({
    colors: {
      bodyColor: '#FFFFFF',
      headerColor: '#6569DF',
      footerColor: '#3CCC38',
    },
    logo: '',
    bgImage: '',
    favIcon: '',
    receiptIcon: '',
    kioskHeaderImage: '',
    mobileAppImage: '',
    qrCodeImage: '',
  }),
  catProdMappings: z.array(catProdMappingSchema).default([]),
  allowBranchIds: z.array(z.string()).default([]),
  beginNumber: z.string().default(''),
  maxSkipNumber: z.number().min(0).default(5),
  scopeBrandIds: z.array(z.string()).default([]),
  initialCategoryIds: z.array(z.string()).default([]),
  kioskExcludeCategoryIds: z.array(z.string()).default([]),
  kioskExcludeProductIds: z.array(z.string()).default([]),
  checkRemainder: z.boolean().default(false),
  permissionConfig: z.record(z.any()).default({}),
  allowTypes: z
    .array(z.enum(['eat', 'take', 'delivery']))
    .default(['eat', 'take', 'delivery']),
  checkExcludeCategoryIds: z.array(z.string()).default([]),
});

export type PosDetailFormValues = z.infer<typeof posDetailSchema>;

export const basicInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  allowTypes: z
    .array(z.enum(['eat', 'take', 'delivery']))
    .min(1, 'At least one type is required'),
  scopeBrandIds: z.array(z.string()).default([]),
  allowBranchIds: z.array(z.string()).default([]),
});

export const permissionSchema = z.object({
  adminTeamMember: z.string().min(1, 'Admin team member is required'),
  adminPrintTempBill: z.boolean().default(false),
  adminDirectSales: z.boolean().default(false),
  adminDirectDiscountLimit: z.string().default(''),

  cashierTeamMember: z.string().min(1, 'Cashier team member is required'),
  cashierPrintTempBill: z.boolean().default(false),
  cashierDirectSales: z.boolean().default(false),
  cashierDirectDiscountLimit: z.string().default(''),

  adminIds: z.array(z.string()).default([]),
  cashierIds: z.array(z.string()).default([]),
  permissionConfig: z.record(z.any()).default({}),
});

export const productSchema = z.object({
  productDetails: z.array(productDetailSchema).default([]),
  catProdMappings: z.array(catProdMappingSchema).default([]),
  initialCategoryIds: z.array(z.string()).default([]),
  kioskExcludeCategoryIds: z.array(z.string()).default([]),
  kioskExcludeProductIds: z.array(z.string()).default([]),
  checkExcludeCategoryIds: z.array(z.string()).default([]),
});

export const paymentSchema = z.object({
  paymentIds: z.array(z.string()).default([]),
  paymentTypes: z.array(paymentTypeSchema).default([]),
});

export const uiConfigSchema = z.object({
  uiOptions: uiOptionsSchema,
  beginNumber: z.string().default(''),
  maxSkipNumber: z.number().min(0).default(5),
  checkRemainder: z.boolean().default(false),
});

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;
export type PermissionFormValues = z.infer<typeof permissionSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
export type PaymentFormValues = z.infer<typeof paymentSchema>;
export type UiConfigFormValues = z.infer<typeof uiConfigSchema>;

export interface FormStepData {
  basicInfo?: BasicInfoFormValues;
  permission?: PermissionFormValues;
  product?: ProductFormValues;
  payment?: PaymentFormValues;
  uiConfig?: UiConfigFormValues;
}

export const combineFormData = (
  stepData: FormStepData,
): Partial<PosDetailFormValues> => {
  return {
    ...stepData.basicInfo,
    ...stepData.permission,
    ...stepData.product,
    ...stepData.payment,
    ...stepData.uiConfig,
  };
};