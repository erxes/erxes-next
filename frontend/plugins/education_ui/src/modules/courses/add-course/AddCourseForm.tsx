import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  Button,
  Sheet,
  Form,
  useToast,
  Preview,
  Separator,
  Resizable,
} from 'erxes-ui';
import { useAddCourse } from '@/courses/hooks/useAddCourse';
import { ApolloError } from '@apollo/client';
import {
  CourseFormType,
  courseFormSchema,
} from '@/courses/add-course/components/formSchema';
import { CourseAddCoreFields } from '@/courses/add-course/components/CourseAddCoreFields';

export function AddCourseForm({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const { courseAdd } = useAddCourse();
  const form = useForm<CourseFormType>({
    resolver: zodResolver(courseFormSchema),
  });
  const { toast } = useToast();
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
        onOpenChange(false);
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full overflow-hidden"
      >
        <Sheet.Content className="flex-auto overflow-hidden">
          <div className="flex h-full flex-auto overflow-auto">
            <div className="flex flex-col flex-auto min-h-full overflow-hidden">
              <Resizable.PanelGroup
                direction="horizontal"
                className="flex-auto min-h-full overflow-hidden"
              >
                <Resizable.Panel>
                  <div className="p-5">
                    <CourseAddCoreFields form={form} />
                    <Separator />
                    <Preview>
                      <Preview.Toolbar
                        path={'/iframe.html?id=components-dialog--default'}
                      />
                      <Preview.View
                        iframeSrc="/iframe.html?id=components-dialog--default"
                        height={400}
                      />
                    </Preview>
                  </div>
                </Resizable.Panel>
              </Resizable.PanelGroup>
            </div>
          </div>
        </Sheet.Content>

        <Sheet.Footer className="flex justify-end flex-shrink-0 p-2.5 gap-1 bg-muted">
          <Button
            type="button"
            variant="ghost"
            className="bg-background hover:bg-background/90"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save
          </Button>
        </Sheet.Footer>
      </form>
    </Form>
  );
}
