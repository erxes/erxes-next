import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Dialog, MultipleSelector, Skeleton } from 'erxes-ui';
import {
  teacherFormSchema,
  TeacherFormType,
} from '@/teachers/add-teacher/components/formSchema';
import { useUsers } from '@/teachers/hooks/useUsers';
import { IUser } from '@/teachers/types/teacherType';

type Option = {
  label: string;
  value: string;
};

export function AddTeacherForm({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const { users, loading } = useUsers({});

  console.log(users);

  // const { classAdd } = useAddClass();
  const form = useForm<TeacherFormType>({
    resolver: zodResolver(teacherFormSchema),
  });
  const onSubmit = (data: TeacherFormType) => {
    // classAdd({
    //   variables: data,
    //   onError: (e: ApolloError) => {
    //     console.log(e.message);
    //     toast({
    //       title: 'Error',
    //       description: e.message,
    //     });
    //   },
    //   onCompleted: () => {
    //     form.reset();
    //     onOpenChange(false);
    //   },
    // });
  };

  if (loading) return <Skeleton className="h-9 w-full" />;

  const modifiedArray: Option[] = users?.map(({ email, _id }: IUser) => ({
    label: email,
    value: _id,
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 py-3">
        <Form.Item className="w-full">
          <Form.Field
            name="userIds"
            key={'userIds'}
            control={form.control}
            render={({ field }: { field: any }) => (
              <div className="space-y-2">
                <Form.Label>Select users</Form.Label>
                <MultipleSelector
                  {...field}
                  options={modifiedArray}
                  placeholder="Select users"
                  hideClearAllButton
                  hidePlaceholderWhenSelected
                  emptyIndicator={
                    <p className="text-center text-sm">No results found</p>
                  }
                />
              </div>
            )}
          />
          <Form.Message />
        </Form.Item>
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
