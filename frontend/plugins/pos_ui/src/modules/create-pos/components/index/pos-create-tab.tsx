import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { posCategoryAtom } from '../../states/posCategory';
import { getSteps, LAYOUT, navigateToTab } from '~/modules/constants';
import { VerticalStepper } from './lay-stepper';
import { PosCreateStepperProps, PosTabContentProps } from '~/modules/pos-detail/types/IPosLayout';

export const PosCreateTabContent: React.FC<PosTabContentProps> = ({
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

export const PosCreateStepper: React.FC<PosCreateStepperProps> = ({ children }) => {
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