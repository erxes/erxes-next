import { UseFormReturn } from 'react-hook-form';
import {
  BasicInfoFormValues,
  PaymentFormValues,
  PermissionFormValues,
  ProductFormValues,
} from '../components/formSchema';
import { CustomNode } from '@/slot/types';

export interface TabConfig {
  value: string;
  component: React.ReactNode;
}
export interface GetPosCreateTabsProps {
  posCategory: 'ecommerce' | 'restaurant' | 'kiosk';
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
