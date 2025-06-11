'use client';

import React, { useMemo, useState } from 'react';
import { Resizable } from 'erxes-ui';
import { useSearchParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { posCategoryAtom } from '../../states/posCategory';
import { PosDetailSheet } from './posDetailSheet';
import { getSteps, navigateToTab } from '~/modules/constants';
import { PosCreateStepper } from './pos-create-tab';
import { NavigationFooter } from './navigation-footer';
import { PosLayoutProps } from '~/modules/pos-detail/types/IPosLayout';

export const PosCreateLayout: React.FC<PosLayoutProps> = ({
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