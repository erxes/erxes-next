import { Button, Form, Resizable, Preview, Separator } from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { IconX } from '@tabler/icons-react';
import { CourseAddCoreFields } from '@/courses/add-course/components/CourseAddCoreFields';
import {
  courseFormSchema,
  CourseFormType,
} from '@/courses/add-course/components/formSchema';
import { zodResolver } from '@hookform/resolvers/zod';

const AddCoursePage = () => {
  const form = useForm<CourseFormType>({
    resolver: zodResolver(courseFormSchema),
  });

  const steps = [
    { key: 'general', label: 'General Information' },
    { key: 'class', label: 'Class, Schedule' },
    { key: 'payment', label: 'Payment, Location' },
    { key: 'teacher', label: 'Teacher' },
  ];

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <>
      <div className="flex justify-between items-center p-6">
        <h2 className="text-lg font-semibold">Хөтөлбөр үүсгэх</h2>
        <div className="w-[28px] h-[28px] bg-gray-200 flex items-center justify-center rounded-sm">
          <IconX size={16} />
        </div>
      </div>
      <Separator />
      <Resizable.PanelGroup direction="horizontal" className="flex-1 h-screen">
        <Resizable.Panel minSize={20} defaultSize={50}>
          <div className="p-6 max-w-2xl mx-auto">
            {/* <div className="flex w-full justify-between gap-2 mb-4">
            {steps.map((step) => {
              const isSelected = selectedStep === step.key;
              return (
                <div
                  key={step.key}
                  onClick={() => setSelectedStep(step.key as 'content' | 'seo')}
                  className="flex flex-col gap-2 items-center w-[40%] cursor-pointer"
                >
                  <div
                    className={`flex gap-2 items-center ${
                      isSelected ? 'text-primary' : 'text-gray-500'
                    }`}
                  >
                    <span>{step.label}</span>
                  </div>
                  <div
                    className={`h-[1px] w-full ${
                      isSelected ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                </div>
              );
            })}
            <Select>
              <Select.Trigger className="w-[15%] text-sm h-8">
                <Select.Value placeholder="MN" />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  <Select.Item value="MN">MN</Select.Item>
                  <Select.Item value="EN">EN</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select>
          </div> */}

            <h2 className="text-lg font-semibold">Үндсэн мэдээлэл оруулах</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <CourseAddCoreFields form={form} />

                <div className="flex w-full justify-between mt-6">
                  <Button variant="outline">Cancel</Button>
                  <Button
                    type="submit"
                    className="bg-primary text-primary-foreground"
                    // loading={loading}
                  >
                    Save
                  </Button>
                </div>
              </form>
            </Form>
          </div>
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

export default AddCoursePage;
