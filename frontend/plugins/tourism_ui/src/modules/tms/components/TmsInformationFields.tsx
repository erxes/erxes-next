import { UseFormReturn } from 'react-hook-form';
import { useAtom } from 'jotai';
import { currentStepAtom } from '@/tms/states/tmsInformationFieldsAtoms';
import { TmsFormType } from '@/tms/constants/formSchema';
import {
  TourName,
  SelectColor,
  LogoField,
  FavIconField,
  GeneralManager,
  Manager,
  Payments,
  Token,
  OtherPayments,
} from '@/tms/components/TmsFormFields';
import { Button } from 'erxes-ui';
import { useEffect } from 'react';

export const TmsInformationFields = ({
  form,
  onOpenChange,
  onSubmit,
  isOpen,
}: {
  form: UseFormReturn<TmsFormType>;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: TmsFormType) => void;
  isOpen?: boolean;
}) => {
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);

  useEffect(() => {
    if (isOpen) setCurrentStep(1);
  }, [isOpen, setCurrentStep]);

  const renderStepContent = () => {
    return (
      <div className="relative w-full">
        {/* Step 1 */}
        <div
          className={`absolute w-full ${currentStep === 1
              ? 'opacity-100 translate-x-0 pointer-events-auto'
              : currentStep < 1
                ? 'opacity-0 translate-x-full pointer-events-none'
                : 'opacity-0 -translate-x-full pointer-events-none'
            }`}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
            <TourName control={form.control} />
            <SelectColor control={form.control} />
            <LogoField control={form.control} />
            <FavIconField control={form.control} />
          </div>
        </div>

        {/* Step 2 */}
        <div
          className={`absolute w-full ${currentStep === 2
              ? 'opacity-100 translate-x-0 pointer-events-auto'
              : currentStep < 2
                ? 'opacity-0 translate-x-full pointer-events-none'
                : 'opacity-0 -translate-x-full pointer-events-none'
            }`}
        >
          <div className="space-y-4">
            <GeneralManager control={form.control} />
            <Manager control={form.control} />
          </div>
        </div>

        {/* Step 3 */}
        <div
          className={`absolute w-full ${currentStep === 3
              ? 'opacity-100 translate-x-0 pointer-events-auto'
              : currentStep < 3
                ? 'opacity-0 translate-x-full pointer-events-none'
                : 'opacity-0 -translate-x-full pointer-events-none'
            }`}
        >
          <div className="space-y-4">
            <Payments control={form.control} />
            <Token control={form.control} />
            <OtherPayments control={form.control} />
          </div>
        </div>
      </div>
    );
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      const result = await form.trigger(['name', 'color']);
      if (result) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  function handleCancel() {
    if (onOpenChange) onOpenChange(false);
  }

  function handleSave() {
    form.trigger(['payment', 'token', 'otherPayments']).then((isValid) => {
      if (isValid && onSubmit) {
        onSubmit(form.getValues());
      }
    });
  }

  return (
    <div className="flex flex-col mx-auto w-full max-w-3xl h-full border-r">
      <div className="flex flex-col flex-shrink-0 gap-3 justify-center items-start self-stretch p-5 border-b">
        <div className="flex gap-2 items-center">
          <div className="flex h-5 px-2 justify-center items-center gap-1 rounded-[21px] bg-[rgba(79,70,229,0.10)] transition-all duration-300">
            <p className="text-primary leading-none text-[12px] font-semibold uppercase font-mono">
              STEP {currentStep}
            </p>
          </div>
          <p className="text-primary font-inter text-[14px] font-semibold leading-[140%] transition-all duration-300">
            {currentStep === 1
              ? 'General information'
              : currentStep === 2
                ? 'Permission'
                : 'Payments'}
          </p>
        </div>
        <div className="flex gap-2 items-center self-stretch">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-1 rounded-full transition-all duration-500 ease-in-out ${step === currentStep
                  ? 'bg-primary w-24'
                  : step < currentStep
                    ? 'bg-primary/50 w-16'
                    : 'bg-[#F4F4F5] w-16'
                }`}
            />
          ))}
        </div>
        <p className="self-stretch text-muted-foreground font-inter text-[13px] font-medium leading-[140%] transition-all duration-300">
          {currentStep === 1
            ? 'Set up your TMS information'
            : currentStep === 2
              ? 'Setup your permission'
              : 'Setup your payments'}
        </p>
      </div>
      <div className="relative flex-1">
        <div className="overflow-y-auto px-4 py-2 h-full max-h-screen">
          {renderStepContent()}
        </div>
      </div>

      <div className="flex flex-shrink-0 gap-2 justify-between items-center p-4 border-t">
        {currentStep === 1 ? (
          <Button
            variant="outline"
            onClick={handleCancel}
            className="transition-all duration-200 hover:scale-105"
          >
            Cancel
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="transition-all duration-200 hover:scale-105"
          >
            Previous
          </Button>
        )}
        {currentStep < 3 ? (
          <Button
            onClick={handleNext}
            className="transition-all duration-200 hover:scale-105"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSave}
            className="transition-all duration-200 hover:scale-105"
          >
            Save
          </Button>
        )}
      </div>
    </div>
  );
};
