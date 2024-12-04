import { useMutation } from '@apollo/client';

import { CreateOwner } from '@/organization/owner/graphql/mutation/createOwner';
import { CreateOwnerFormType } from '@/organization/owner/hooks/useCreateOwnerForm';
import { useToast } from 'erxes-ui';

export const useCreateOwner = () => {
  const { toast } = useToast();

  const [createOwnerMutation] = useMutation(CreateOwner);

  const createOwner = async (input: CreateOwnerFormType) => {
    await createOwnerMutation({ variables: input })
      .then(() => {
        toast({
          title: 'Success',
          description:
            'Password reset instructions have been sent to your email.',
        });
      })
      .catch((e) => {
        toast({
          title: 'Uh oh! Something went wrong.',
          description: e.message,
        });
      });
  };

  return { createOwner };
};
