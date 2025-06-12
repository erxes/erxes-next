import { UseFormReturn } from "react-hook-form";
import { BasicInfoFormValues, PaymentFormValues, PermissionFormValues, ProductFormValues } from "../components/formSchema";
import { CustomNode } from "~/modules/slot/types";

export interface GetPosCreateTabsProps {
    posCategory: 'ecommerce' | 'restaurant';
    forms: {
      basicInfo: UseFormReturn<BasicInfoFormValues>;
      permission: UseFormReturn<PermissionFormValues>;
      product: UseFormReturn<ProductFormValues>;
      payment: UseFormReturn<PaymentFormValues>;
    };
    handlers: {
      handlePaymentSubmit: (data: PaymentFormValues) => void;
      handlePermissionSubmit: (data: PermissionFormValues) => void;
      handleNodesUpdate: (nodes: CustomNode[]) => void;
    };
    data: {
      createdPosId: string | null;
      slotNodes: CustomNode[];
    };
  }
  
export interface TabConfig {
    value: string;
    component: React.ReactNode;
  }

  