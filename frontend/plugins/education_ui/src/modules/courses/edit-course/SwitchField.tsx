import { Switch, useToast } from 'erxes-ui';
import { CoreCell } from '@tanstack/react-table';
import { useChangeCourseStatus } from '@/courses/hooks/useChangeCourseStatus';
import { ApolloError } from '@apollo/client';

export const SwitchField = ({ cell }: { cell: CoreCell<any, any> }) => {
  const { changeCourseStatus } = useChangeCourseStatus();
  const { toast } = useToast();
  return (
    <div className="flex justify-center">
      <Switch
        className="scale-150"
        checked={cell.getValue() === 'active'}
        onCheckedChange={(checked) => {
          changeCourseStatus({
            variables: {
              id: cell.row.original._id,
              status: checked ? 'active' : 'draft',
            },
            onError: (e: ApolloError) => {
              toast({
                title: 'Error',
                description: e.message,
              });
            },
          });
        }}
      />
    </div>
  );
};
