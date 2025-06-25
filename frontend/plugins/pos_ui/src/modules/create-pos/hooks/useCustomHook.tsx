import { useState, useCallback } from 'react';
import { useToast } from 'erxes-ui/hooks';
import { CustomNode } from '@/slot/types';
import {
  BasicInfoFormValues,
  FormStepData,
  DeliveryConfigFormValues,
  FinanceConfigFormValues,
} from '../components/formSchema';
import { useSubmitPosForm } from '~/modules/hooks/usePosAdd';
import { useUpdatePosSlots } from '~/modules/hooks/useSlotAdd';
import { TOAST_MESSAGES } from '~/modules/constants';
import { SlotData, UsePosCreateHandlersProps } from '~/modules/create-pos/types';

const transformSlotNodes = (nodes: CustomNode[], posId: string): SlotData[] => {
  return nodes.map((node) => ({
    code: node.data.code,
    name: node.data.label,
    posId,
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
};

const validateDeliveryConfigData = (deliveryData: DeliveryConfigFormValues): boolean => {
  return !!(
    deliveryData.boardId &&
    deliveryData.pipeline &&
    deliveryData.stage &&
    deliveryData.deliveryProduct
  );
};

export const usePosCreateHandlers = ({
  forms,
  formStepData,
}: UsePosCreateHandlersProps) => {
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
  
  const { toast } = useToast();

  const [createdPosId, setCreatedPosId] = useState<string | null>(null);
  const [slotNodes, setSlotNodes] = useState<CustomNode[]>([]);

  const handleBasicInfoSubmit = useCallback((data: BasicInfoFormValues) => {
    forms.basicInfo.reset(data);
  }, [forms.basicInfo]);

  const handleDeliveryConfigSubmit = useCallback((data: DeliveryConfigFormValues) => {
    if (!forms.deliveryConfig) return;

    forms.deliveryConfig.reset(data);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Delivery Config Updated:', {
        boardId: data.boardId,
        pipeline: data.pipeline,
        stage: data.stage,
        watchedUsers: data.watchedUsers,
        assignedUsers: data.assignedUsers,
        deliveryProduct: data.deliveryProduct,
        watchedUserIds: data.watchedUserIds,
        assignedUserIds: data.assignedUserIds,
      });
    }
  }, [forms.deliveryConfig]);

  const handleFinanceConfigSubmit = useCallback((data: FinanceConfigFormValues) => {
    if (!forms.financeConfig) return;

    forms.financeConfig.reset(data);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Finance Config Updated:', {
        isSyncErkhet: data.isSyncErkhet,
        checkErkhet: data.checkErkhet,
        checkInventories: data.checkInventories,
        userEmail: data.userEmail,
        beginBillNumber: data.beginBillNumber,
        defaultPay: data.defaultPay,
        account: data.account,
        location: data.location,
        getRemainder: data.getRemainder,
      });
    }
  }, [forms.financeConfig]);

  const handleSaveSlots = useCallback(async (posId: string): Promise<void> => {
    if (!posId || slotNodes.length === 0) return;

    try {
      const slotsData = transformSlotNodes(slotNodes, posId);

      await updatePosSlots({
        variables: { posId, slots: slotsData },
      });

      toast({
        title: TOAST_MESSAGES.SLOTS_SAVED,
        description: `Saved ${slotsData.length} slots`,
      });
    } catch (error) {
      console.error('Failed to save slots:', error);
      toast({
        title: TOAST_MESSAGES.SLOTS_SAVE_FAILED,
        description: TOAST_MESSAGES.TRY_AGAIN,
        variant: 'destructive',
      });
      throw error;
    }
  }, [slotNodes, updatePosSlots, toast]);

  const handleNodesUpdate = useCallback((nodes: CustomNode[]) => {
    setSlotNodes(nodes);
  }, []);

  const handleFinalSubmit = useCallback(async (): Promise<void> => {
    try {
      const financeConfigData = forms.financeConfig?.getValues();
      const deliveryConfigData = forms.deliveryConfig?.getValues();
      const basicInfo = forms.basicInfo.getValues();
      if (!basicInfo.name || !basicInfo.description) {
        toast({
          title: 'Missing required fields',
          description: 'Name and Description are required.',
          variant: 'destructive',
        });
        return;
      }

      const finalFormStepData: FormStepData = {
        ...formStepData,
        basicInfo,
        permission: {
          ...forms.permission.getValues(),
          adminIds: forms.permission.getValues().adminTeamMember
            ? [forms.permission.getValues().adminTeamMember]
            : [],
          cashierIds: forms.permission.getValues().cashierTeamMember
            ? [forms.permission.getValues().cashierTeamMember]
            : [],
        },
        ...(financeConfigData && { financeConfig: financeConfigData }),
        ...(deliveryConfigData &&{deliveryConfig: deliveryConfigData}),
      };
      console.log('Final form data:', finalFormStepData);

      const result = await submitForm(finalFormStepData);

      if (!result?.data?.posAdd?._id) {
        throw new Error('POS creation failed: No ID returned');
      }

      const posId = result.data.posAdd._id;
      setCreatedPosId(posId);

      if (slotNodes.length > 0) {
        await handleSaveSlots(posId);
      }

      const successMessage = financeConfigData 
        ? TOAST_MESSAGES.POS_CREATED_WITH_DELIVERY
        : TOAST_MESSAGES.POS_CREATED;

      toast({
        title: successMessage,
        description: financeConfigData 
          ? 'POS created with finance configuration' 
          : 'POS has been created successfully',
      });

    } catch (error) {
      console.error('Failed to create POS:', error);
      toast({
        title: TOAST_MESSAGES.POS_CREATION_FAILED,
        description: TOAST_MESSAGES.TRY_AGAIN,
        variant: 'destructive',
      });
      throw error;
    }
  }, [
    forms,
    formStepData,
    submitForm,
    slotNodes,
    handleSaveSlots,
    toast,
  ]);

  const getCurrentDeliveryConfig = useCallback(() => {
    if (!forms.deliveryConfig) return null;
    
    const deliveryData = forms.deliveryConfig.getValues();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Current delivery config:', deliveryData);
    }
    
    return deliveryData;
  }, [forms.deliveryConfig]);

  const getCurrentFinanceConfig = useCallback(() => {
    if (!forms.financeConfig) return null;
    
    const financeData = forms.financeConfig.getValues();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Current finance config:', financeData);
    }
    
    return financeData;
  }, [forms.financeConfig]);

  const validateDeliveryConfig = useCallback((): boolean => {
    if (!forms.deliveryConfig) return true;
    
    const deliveryData = forms.deliveryConfig.getValues();
    const isValid = validateDeliveryConfigData(deliveryData);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Delivery config validation:', { isValid, deliveryData });
    }
    
    return isValid;
  }, [forms.deliveryConfig]);

  const getAllFormValues = useCallback(() => {
    const allValues = {
      basicInfo: forms.basicInfo.getValues(),
      permission: forms.permission.getValues(),
      product: forms.product.getValues(),
      payment: forms.payment.getValues(),
      ...(forms.uiConfig && { uiConfig: forms.uiConfig.getValues() }),
      ...(forms.deliveryConfig && { deliveryConfig: forms.deliveryConfig.getValues() }),
      ...(forms.financeConfig && { financeConfig: forms.financeConfig.getValues() }),
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.log('All form values:', allValues);
    }
    
    return allValues;
  }, [forms]);

  return {
    handleBasicInfoSubmit,
    handleDeliveryConfigSubmit,
    handleFinanceConfigSubmit,
    handleFinalSubmit,
    handleNodesUpdate,
    handleSaveSlots,
    
    getCurrentDeliveryConfig,
    getCurrentFinanceConfig,
    validateDeliveryConfig,
    getAllFormValues,
    
    loading: posLoading || slotLoading,
    error: posError || slotError,
    createdPosId,
    slotNodes,
  };
};