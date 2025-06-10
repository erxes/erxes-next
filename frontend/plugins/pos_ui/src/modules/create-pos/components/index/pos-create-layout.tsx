'use client';

import React, { useMemo, useState } from 'react';
import { Stepper, Resizable, Button } from 'erxes-ui';
import { useSearchParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { posCategoryAtom } from '../../states/posCategory';
import { IconCheck, IconLoader2, IconAlertCircle } from '@tabler/icons-react';
import { PosDetailSheet } from './posDetailSheet';
import { UseFormReturn } from 'react-hook-form';
import { BasicInfoFormValues, PermissionFormValues } from '../formSchema';

const LAYOUT = {
  STEPPER_WIDTH: 'w-44',
  CONTENT_MAX_HEIGHT: 'max-h-[calc(100vh-120px)]',
  STEPPER_INDICATOR_LEFT: 'left-[18px]',
  STEPPER_SEPARATOR_TOP: 'top-9',
  STEPPER_SEPARATOR_HEIGHT: 'h-8',
};

type StepConfig = {
  value: string;
  title: string;
};

type StepType = StepConfig & {
  id: number;
  totalSteps?: number;
};

const getSteps = (posCategory: string | null): StepConfig[] => {
  const baseSteps: StepConfig[] = [
    { value: 'overview', title: 'Choose category' },
    { value: 'properties', title: 'General information' },
    { value: 'payments', title: 'Payments' },
    { value: 'permission', title: 'Permission' },
    { value: 'product', title: 'Product & Service' },
    { value: 'appearance', title: 'Appearance' },
    { value: 'screen', title: 'Screen config' },
    { value: 'ebarimt', title: 'Ebarimt config' },
    { value: 'finance', title: 'Finance config' },
    { value: 'delivery', title: 'Delivery config' },
    { value: 'sync', title: 'Sync card' },
  ];

  if (posCategory === 'restaurant') {
    const updatedSteps = [...baseSteps];
    updatedSteps.splice(2, 0, { value: 'slot', title: 'Slot' });
    return updatedSteps;
  }

  return baseSteps;
};

const navigateToTab = (
  setSearchParams: (params: URLSearchParams) => void,
  searchParams: URLSearchParams,
  tabValue: string,
): void => {
  const newParams = new URLSearchParams(searchParams);
  newParams.set('tab', tabValue);
  setSearchParams(newParams);
};

interface StepperItemProps {
  step: StepType;
  currentStep: number;
  isClickable: boolean;
}

const StepperItem = React.memo(
  ({ step, currentStep, isClickable }: StepperItemProps) => (
    <Stepper.Item
      step={step.id}
      completed={currentStep > step.id}
      className="relative mb-12 last:mb-0"
    >
      <Stepper.Trigger
        className={`flex items-center gap-4 w-full text-left
        ${step.id === currentStep ? 'opacity-100' : 'opacity-60'}
        ${isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}
        ${currentStep > step.id ? 'text-blue-600' : ''}`}
        disabled={!isClickable}
        aria-label={`Step ${step.id}: ${step.title}`}
        aria-current={step.id === currentStep ? 'step' : undefined}
      >
        <Stepper.Indicator className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium shadow-sm border border-gray-200 data-[state=completed]:border-blue-500 data-[state=completed]:shadow-blue-100">
          {currentStep > step.id ? <IconCheck className="h-4 w-4" /> : step.id}
        </Stepper.Indicator>
        <span
          className={`text-base font-medium ${
            currentStep > step.id ? 'text-blue-600' : ''
          }`}
        >
          {step.title}
        </span>
      </Stepper.Trigger>
      {step.id < (step.totalSteps || 0) && (
        <Stepper.Separator
          className={`absolute ${LAYOUT.STEPPER_INDICATOR_LEFT} ${LAYOUT.STEPPER_SEPARATOR_TOP} ${LAYOUT.STEPPER_SEPARATOR_HEIGHT} -translate-x-1/2 group-data-[state=completed]/step:bg-blue-500`}
        />
      )}
    </Stepper.Item>
  ),
);

interface VerticalStepperProps {
  steps: StepType[];
  currentStepId: number;
  hasCategorySelected: boolean;
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
}

const VerticalStepper = React.memo(
  ({
    steps,
    currentStepId,
    hasCategorySelected,
    searchParams,
    setSearchParams,
  }: VerticalStepperProps) => {
    const handleStepChange = (stepId: number): void => {
      if (
        (stepId === currentStepId + 1 || stepId === currentStepId - 1) &&
        (stepId === 1 || hasCategorySelected)
      ) {
        const targetStep = steps.find((step) => step.id === stepId);
        if (targetStep) {
          navigateToTab(setSearchParams, searchParams, targetStep.value);
        }
      }
    };

    return (
      <div className={`${LAYOUT.STEPPER_WIDTH} border-r bg-gray-50 p-5 overflow-y-auto`}>
        <Stepper
          value={currentStepId}
          onValueChange={handleStepChange}
          orientation="vertical"
          className="w-full"
        >
          {steps.map((step) => {
            const isClickable =
              step.id === currentStepId + 1 || step.id === currentStepId - 1;
            return (
              <StepperItem
                key={step.id}
                step={{ ...step, totalSteps: steps.length }}
                currentStep={currentStepId}
                isClickable={isClickable}
              />
            );
          })}
        </Stepper>
      </div>
    );
  },
);

interface ValidationAlertProps {
  message: string;
}

const ValidationAlert: React.FC<ValidationAlertProps> = ({ message }) => (
  <div className="flex items-center gap-2 p-3 text-red-600 bg-red-50 border border-red-200 rounded-md mb-4">
    <IconAlertCircle className="h-5 w-5 flex-shrink-0" />
    <span>{message}</span>
  </div>
);

interface NavigationFooterProps {
  prevStep: string | null;
  nextStep: string | null;
  handlePrevStep: () => void;
  handleNextStep: () => void;
  isLastStep: boolean;
  isLoading?: boolean;
  validationError?: string | null;
  isSubmitting?: boolean;
}

const NavigationFooter = React.memo(
  ({
    prevStep,
    nextStep,
    handlePrevStep,
    handleNextStep,
    isLastStep,
    isLoading = false,
    validationError = null,
    isSubmitting = false,
  }: NavigationFooterProps) => (
    <div className="flex flex-col p-4 border-t sticky bottom-0 bg-white">
      {validationError && <ValidationAlert message={validationError} />}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevStep}
          disabled={!prevStep || isLoading || isSubmitting}
        >
          Previous
        </Button>
        <Button
          type="button"
          onClick={handleNextStep}
          disabled={(!nextStep && !isLastStep) || isLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? (
            <span className="flex items-center gap-2">
              <IconLoader2 className="h-4 w-4 animate-spin" />
              {isLastStep ? 'Saving...' : 'Loading...'}
            </span>
          ) : isLastStep ? (
            'Save POS'
          ) : (
            'Next step'
          )}
        </Button>
      </div>
    </div>
  ),
);

interface PosCreateTabContentProps {
  children: React.ReactNode;
  value: string;
}

export const PosCreateTabContent: React.FC<PosCreateTabContentProps> = ({
  children,
  value,
}) => {
  const [searchParams] = useSearchParams();
  const [posCategory] = useAtom(posCategoryAtom);
  const selectedStep = searchParams.get('tab') || 'overview';
  const hasCategorySelected = !!posCategory;

  if (value !== selectedStep) {
    return null;
  }

  if (value !== 'overview' && !hasCategorySelected) {
    return (
      <div className="flex-auto overflow-hidden flex items-center justify-center h-full">
        <div className="text-center p-8 rounded-lg bg-yellow-50 border border-yellow-200">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            Category Selection Required
          </h3>
          <p className="text-yellow-700">
            Please select a category first before accessing this section.
          </p>
        </div>
      </div>
    );
  }

  return <div className="flex-auto overflow-auto">{children}</div>;
};

interface PosCreateStepperProps {
  children: React.ReactNode;
}

const PosCreateStepper: React.FC<PosCreateStepperProps> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posCategory] = useAtom(posCategoryAtom);
  const selectedStep = searchParams.get('tab') || 'overview';
  const hasCategorySelected = !!posCategory;

  const stepsWithIds = useMemo(() => {
    return getSteps(posCategory).map((step, idx) => ({
      ...step,
      id: idx + 1,
    }));
  }, [posCategory]);

  const currentStepId = useMemo(() => {
    return stepsWithIds.find((step) => step.value === selectedStep)?.id || 1;
  }, [stepsWithIds, selectedStep]);

  React.useEffect(() => {
    if (
      selectedStep &&
      !stepsWithIds.some((step) => step.value === selectedStep)
    ) {
      navigateToTab(setSearchParams, searchParams, 'overview');
    }
  }, [selectedStep, stepsWithIds, setSearchParams, searchParams]);

  return (
    <div className="flex h-full">
      <VerticalStepper
        steps={stepsWithIds}
        currentStepId={currentStepId}
        hasCategorySelected={hasCategorySelected}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <div className={`flex-1 overflow-auto p-6 ${LAYOUT.CONTENT_MAX_HEIGHT}`}>
        {children}
      </div>
    </div>
  );
};

interface PosCreateLayoutProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
  form?: UseFormReturn<BasicInfoFormValues, PermissionFormValues>;
  onFormSubmit?: (data: BasicInfoFormValues) => void;
  onFinalSubmit?: () => void;
  isSubmitting?: boolean;
  loading: boolean;
  error: any;
  onSaveSlots?: () => Promise<void>;
}

export const PosCreateLayout: React.FC<PosCreateLayoutProps> = ({
  children,
  actions,
  form,
  onFormSubmit,
  onFinalSubmit,
  isSubmitting = false,
  onSaveSlots,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posCategory] = useAtom(posCategoryAtom);
  const selectedStep = searchParams.get('tab') || 'overview';
  const [isLoading, setIsLoading] = React.useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const steps = useMemo(() => {
    return getSteps(posCategory).map((step, idx) => ({ ...step, id: idx + 1 }));
  }, [posCategory]);

  const currentStepIndex = steps.findIndex(
    (step) => step.value === selectedStep,
  );
  const prevStep =
    currentStepIndex > 0 ? steps[currentStepIndex - 1].value : null;
  const nextStep =
    currentStepIndex < steps.length - 1
      ? steps[currentStepIndex + 1].value
      : null;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handlePrevStep = (): void => {
    setValidationError(null);
    if (prevStep) {
      navigateToTab(setSearchParams, searchParams, prevStep);
    }
  };

  const validateCurrentStep = (): boolean => {
    if (selectedStep === 'properties' && form) {
      const values = form.getValues();

      if (!values.name?.trim()) {
        setValidationError('Please enter a name before proceeding.');
        return false;
      }

      if (!values.description?.trim()) {
        setValidationError('Please enter a description before proceeding.');
        return false;
      }

      if (!values.allowTypes || values.allowTypes.length === 0) {
        setValidationError(
          'Please select at least one type before proceeding.',
        );
        return false;
      }
    }
    return true;
  };

  const handleNextStep = async (): Promise<void> => {
    setValidationError(null);

    if (!validateCurrentStep()) {
      return;
    }

    if (selectedStep === 'properties' && form && onFormSubmit) {
      try {
        setIsLoading(true);
        const isValid = await form.trigger();

        if (!isValid) {
          setValidationError('Please fix the form errors before proceeding.');
          return;
        }

        const formData = form.getValues();
        onFormSubmit(formData);
      } catch (error) {
        console.error('Form submission error:', error);
        setValidationError('Failed to save form data. Please try again.');
        return;
      } finally {
        setIsLoading(false);
      }
    }

    if (isLastStep) {
      try {
        setIsLoading(true);

        if (selectedStep === 'slot' && onSaveSlots) {
          try {
            await onSaveSlots();
          } catch (error) {
            console.error('Error saving slots:', error);
            setValidationError('Failed to save slots. Please try again.');
            return;
          }
        }

        if (onFinalSubmit) {
          await onFinalSubmit();
        }
      } catch (error) {
        console.error('Error saving:', error);
        setValidationError('Failed to save. Please try again.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (nextStep) {
      navigateToTab(setSearchParams, searchParams, nextStep);
    }
  };

  return (
    <PosDetailSheet>
      <div className="flex h-auto flex-auto overflow-auto bg-white">
        <div className="flex flex-col flex-auto min-h-full overflow-hidden">
          <Resizable.PanelGroup
            direction="horizontal"
            className="flex-auto min-h-full overflow-hidden"
          >
            <Resizable.Panel defaultSize={75} minSize={30}>
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-auto min-h-0">
                  <PosCreateStepper>{children}</PosCreateStepper>
                </div>

                <NavigationFooter
                  prevStep={prevStep}
                  nextStep={nextStep}
                  handlePrevStep={handlePrevStep}
                  handleNextStep={handleNextStep}
                  isLastStep={isLastStep}
                  isLoading={isLoading}
                  validationError={validationError}
                  isSubmitting={isSubmitting}
                />
              </div>
            </Resizable.Panel>

            {actions && (
              <>
                <Resizable.Handle />
                <Resizable.Panel defaultSize={25} minSize={20}>
                  {actions}
                </Resizable.Panel>
              </>
            )}
          </Resizable.PanelGroup>
        </div>
      </div>
    </PosDetailSheet>
  );
};