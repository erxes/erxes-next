import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button, ScrollArea, Sheet, Form, useToast } from 'erxes-ui';
import {
  ClassFormType,
  classFormSchema,
} from '@/classes/add-class/components/formSchema';
import { ClassAddSheetHeader } from '@/classes/add-class/components/ClassAddSheet';
import { ClassAddCoreFields } from '@/classes/add-class/components/ClassAddCoreFields';
import { useAddClass } from '@/classes/hooks/useAddClass';
import { ApolloError } from '@apollo/client';

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
        className="flex flex-col h-full overflow-hidden"
      >
        <ClassAddSheetHeader />
        <Sheet.Content className="flex-auto overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-5">
              <ClassAddCoreFields form={form} />
            </div>
          </ScrollArea>
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
