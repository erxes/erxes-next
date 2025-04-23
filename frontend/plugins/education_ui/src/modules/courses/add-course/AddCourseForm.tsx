import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button, ScrollArea, Sheet, Form, useToast } from 'erxes-ui';
import { useAddCourse } from '@/courses/hooks/useAddCourse';
import { ApolloError } from '@apollo/client';
import {
  CourseFormType,
  courseFormSchema,
} from '@/courses/add-course/components/formSchema';
import {
  CourseAddSheet,
  CourseAddSheetHeader,
} from '@/courses/add-course/components/CustomerAddSheet';
import { CourseAddCoreFields } from '@/courses/add-course/components/CourseAddCoreFields';

export function AddCourseForm() {
  const [open, setOpen] = useState<boolean>(false);
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
        setOpen(false);
      },
    });
  };

  return (
    <CourseAddSheet onOpenChange={setOpen} open={open}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex flex-col h-full"
        >
          <ScrollArea className="flex-auto">
            <CourseAddSheetHeader />
            <div className="px-5">
              <CourseAddCoreFields form={form} />
            </div>
          </ScrollArea>

          <Sheet.Footer className="flex justify-end flex-shrink-0 p-2.5 gap-1 bg-muted">
            <Button
              type="button"
              variant="ghost"
              className="bg-background hover:bg-background/90"
              onClick={() => setOpen(false)}
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
    </CourseAddSheet>
  );
}
