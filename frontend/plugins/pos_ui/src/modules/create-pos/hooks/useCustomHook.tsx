import { useState } from 'react';
import { useSubmitPosForm } from '~/modules/hooks/usePosAdd';
import { useUpdatePosSlots } from '~/modules/hooks/useSlotAdd';
import { useToast } from 'erxes-ui/hooks';
import { CustomNode } from '~/modules/slot/types';
import { BasicInfoFormValues, FormStepData, PaymentFormValues, PermissionFormValues, ProductFormValues } from '../components/formSchema';
import { UseFormReturn } from 'react-hook-form';
interface UsePosCreateHandlersProps {
  forms: {
    basicInfo: UseFormReturn<BasicInfoFormValues>;
    permission: UseFormReturn<PermissionFormValues>;
    product: UseFormReturn<ProductFormValues>;
    payment: UseFormReturn<PaymentFormValues>;
  };
  formStepData: FormStepData;
}

export const usePosCreateHandlers = ({
  forms,
  formStepData,
}: UsePosCreateHandlersProps) => {
  const { submitForm, loading: posLoading, error: posError } = useSubmitPosForm();
  const { updatePosSlots, loading: slotLoading, error: slotError } = useUpdatePosSlots();
  const [createdPosId, setCreatedPosId] = useState<string | null>(null);
  const [slotNodes, setSlotNodes] = useState<CustomNode[]>([]);
  const { toast } = useToast();

  const handleBasicInfoSubmit = (data: BasicInfoFormValues) => {
    console.log('Basic info data updated:', data);
  };

  const handlePermissionSubmit = (data: PermissionFormValues) => {
    console.log('Permission data updated:', data);
  };

  const handlePaymentSubmit = (data: PaymentFormValues) => {
    console.log('Payment data updated:', data);
  };

  const handleSaveSlots = async (posId: string) => {
    if (!posId || slotNodes.length === 0) return;

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
        variables: { posId, slots: slotsData },
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
      const finalFormStepData = {
        ...formStepData,
        basicInfo: forms.basicInfo.getValues(),
        permission: {
          ...forms.permission.getValues(),
          adminIds: forms.permission.getValues().adminTeamMember
            ? [forms.permission.getValues().adminTeamMember]
            : [],
          cashierIds: forms.permission.getValues().cashierTeamMember
            ? [forms.permission.getValues().cashierTeamMember]
            : [],
        },
        product: forms.product.getValues(),
        payment: forms.payment.getValues(),
      };

      const result = await submitForm(finalFormStepData);

      if (result?.data?.posAdd?._id) {
        const posId = result.data.posAdd._id;
        setCreatedPosId(posId);

        if (slotNodes.length > 0) {
          await handleSaveSlots(posId);
        }

        toast({
          title: 'POS created successfully',
          description: 'POS has been created',
        });
      }
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

  return {
    handleBasicInfoSubmit,
    handlePermissionSubmit,
    handlePaymentSubmit,
    handleFinalSubmit,
    handleNodesUpdate,
    handleSaveSlots,
    loading: posLoading || slotLoading,
    error: posError || slotError,
    createdPosId,
    slotNodes,
  };
};