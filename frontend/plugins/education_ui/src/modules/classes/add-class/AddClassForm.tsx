import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Form, useToast, Dialog } from 'erxes-ui';
import { useAddClass } from '@/classes/hooks/useAddClass';
import { ApolloError } from '@apollo/client';
import { ClassAddCoreFields } from '@/classes/add-class/components/ClassAddCoreFields';
import {
  classFormSchema,
  ClassFormType,
} from '@/classes/add-class/components/formSchema';

export function AddClassForm({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const { classAdd } = useAddClass();
  const form = useForm<ClassFormType>({
    resolver: zodResolver(classFormSchema),
  });
  const { toast } = useToast();
  const onSubmit = (data: ClassFormType) => {
    classAdd({
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
        <ClassAddCoreFields form={form} />
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
