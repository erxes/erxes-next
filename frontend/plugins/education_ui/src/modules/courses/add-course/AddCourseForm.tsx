import {
  Button,
  Form,
  Resizable,
  Preview,
  Separator,
  useToast,
} from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { IconX } from '@tabler/icons-react';
import {
  courseFormSchema,
  CourseFormType,
} from '@/courses/add-course/components/formSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Link } from 'react-router';
import {
  CourseAddCoreFields,
  CourseAddScheduleFields,
  CourseAddUtilsFields,
} from '@/courses/add-course/components/steps';
import { useAddCourse } from '@/courses/hooks/useAddCourse';
import { ApolloError } from '@apollo/client';

type CourseStep = {
  label: string;
  component?: React.ComponentType<any>;
};

const courseSteps: CourseStep[] = [
  {
    label: 'Үндсэн мэдээлэл оруулах',
    component: CourseAddCoreFields,
  },
  { label: 'Анги, хуваарь', component: CourseAddScheduleFields },
  { label: 'Төлбөр, байршил', component: CourseAddUtilsFields },
];

const AddCourseForm = () => {
  const [currentStep, setStep] = useState(0);
  const { courseAdd } = useAddCourse();
  const { toast } = useToast();
  const form = useForm<CourseFormType>({
    resolver: zodResolver(courseFormSchema),
  });

  const onSubmit = (data: CourseFormType) => {
    courseAdd({
      variables: data,
      onError: (e: ApolloError) => {
        console.log(e.message);
        toast({
          title: 'Error',
          description: e.message,
        });
      },
      onCompleted: () => {
        form.reset();
      },
    });
  };

  const handleNextStep = () => {
    if (currentStep < courseSteps.length - 1) {
      return setStep((prev) => prev + 1);
    }
    form.handleSubmit(onSubmit)();
  };
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setStep((prev) => prev - 1);
    }
  };

  console.log(form.formState.errors, 'Errors');

  return (
    <>
      <div className="flex justify-between items-center p-6">
        <h2 className="text-lg font-semibold">Хөтөлбөр үүсгэх</h2>
        <div className="w-[28px] h-[28px] bg-gray-200 flex items-center justify-center rounded-sm">
          <Link to={'/courses'}>
            <IconX size={16} />
          </Link>
        </div>
      </div>
      <Separator />
      <Resizable.PanelGroup direction="horizontal" className="flex-1 h-screen">
        <Resizable.Panel minSize={20} defaultSize={50}>
          <div className="p-6">
            <div className="flex flex-row items-center gap-2">
              <div className="rounded-full flex items-center justify-center px-3 py-2 bg-indigo-50 border-2 border-primary/5 ">
                <span className="text-primary text-xs font-bold ">
                  АЛХАМ {currentStep + 1}
                </span>
              </div>
              <h2 className="text-sm font-bold text-primary">
                {courseSteps[currentStep]?.label}
              </h2>
            </div>
            <div className="flex space-x-2 mt-3">
              {courseSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-[85px] rounded-full ${
                    index <= currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <Separator />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col flex-1 min-h-0"
              style={{ height: '100%' }}
            >
              {courseSteps.map((step, index) => (
                <div
                  key={index}
                  className={`${
                    index === currentStep ? 'flex' : 'hidden'
                  } flex-col flex-1 min-h-0`}
                  style={{ flex: 1, minHeight: 0 }}
                >
                  {step.component && (
                    <div className="flex-1 min-h-0 p-6 flex flex-col">
                      <step.component form={form} className="flex-1 min-h-0" />
                    </div>
                  )}
                </div>
              ))}
              <Separator />
              <div className="flex w-full justify-between p-6 mt-auto sticky bottom-0">
                <Link to={'/courses'}>
                  <Button
                    type="button"
                    variant="ghost"
                    className="bg-background hover:bg-background/90"
                  >
                    Cancel
                  </Button>
                </Link>
                <div className="flex gap-2">
                  {currentStep !== 0 && (
                    <Button
                      variant={'ghost'}
                      className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                      onClick={handlePreviousStep}
                    >
                      Previous
                    </Button>
                  )}
                  <Button
                    className="bg-primary text-primary-foreground"
                    onClick={handleNextStep}
                  >
                    {currentStep === courseSteps.length - 1 ? 'Submit' : 'Next'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </Resizable.Panel>

        <Resizable.Handle />

        <Resizable.Panel minSize={20} defaultSize={50}>
          <div className="flex justify-center items-center flex-col p-6 gap-6">
            <h2 className="text-lg font-semibold">Урьдчилан харах</h2>
            <Preview>
              <Preview.Toolbar path={'/courses/add-course'} />
              <Preview.View
                iframeSrc="/iframe.html?id=components-dialog--default"
                height={400}
              />
            </Preview>
          </div>
        </Resizable.Panel>
      </Resizable.PanelGroup>
    </>
  );
};

export default AddCourseForm;
