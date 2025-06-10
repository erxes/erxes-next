import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, useToast, Dialog } from 'erxes-ui';
import { CourseCategoryAddCoreFields } from '@/courses/add-category/components/CourseCategoryAddCoreFields';
import {
  courseCategoryFormSchema,
  CourseCategoryFormType,
} from '@/courses/add-category/components/formSchema';
import { useAddCourseCategory } from '@/courses/hooks/useAddCourseCategory';
import { ApolloError } from '@apollo/client';

export function AddCourseCategoryForm({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const { courseCategoryAdd } = useAddCourseCategory();
  const form = useForm<CourseCategoryFormType>({
    resolver: zodResolver(courseCategoryFormSchema),
  });
  const { toast } = useToast();
  const onSubmit = (data: CourseCategoryFormType) => {
    courseCategoryAdd({
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
        className="grid gap-5 grid-cols-2 py-3"
      >
        <CourseCategoryAddCoreFields form={form} />
        <Dialog.Footer className="col-span-2 mt-3 gap-2">
          <Dialog.Close asChild>
            <Button variant="outline" size="lg">
              Cancel
            </Button>
          </Dialog.Close>
          <Button type="submit" size="lg">
            Submit
          </Button>
        </Dialog.Footer>
      </form>
    </Form>
  );
}
