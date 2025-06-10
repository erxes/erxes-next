import { Button } from 'erxes-ui/components';
import { IconTrash } from '@tabler/icons-react';
import { useConfirm } from 'erxes-ui/hooks';
import { useToast } from 'erxes-ui';
import { ApolloError } from '@apollo/client';
import { useRemoveCourses } from '@/courses/hooks/useRemoveCourses';

export const CoursesDelete = ({ courseIds }: { courseIds: string[] }) => {
  const { confirm } = useConfirm();
  const { removeCourses } = useRemoveCourses();
  const { toast } = useToast();
  return (
    <Button
      variant="secondary"
      className="text-destructive"
      onClick={() =>
        confirm({
          message: `Are you sure you want to delete the ${courseIds.length} selected courses?`,
        }).then(() => {
          removeCourses(courseIds, {
            onError: (e: ApolloError) => {
              toast({
                title: 'Error',
                description: e.message,
                variant: 'destructive',
              });
            },
          });
        })
      }
    >
      <IconTrash />
      Delete
    </Button>
  );
};
