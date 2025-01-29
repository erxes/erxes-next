import { useMutation } from '@apollo/client';

import { CreateOwner } from '@/organization/owner/graphql/mutation/createOwner';
import { CreateOwnerFormType } from '@/organization/owner/hooks/useCreateOwnerForm';
import { useToast } from 'erxes-ui/hooks';

import { useRecoilState } from 'recoil';
import { currentOrganizationState } from 'erxes-shared-states';

export const useCreateOwner = () => {
  const { toast } = useToast();

  const [createOwnerMutation] = useMutation(CreateOwner);
  const [currentOrganization, setCurrentOrganization] = useRecoilState(
    currentOrganizationState
  );

  const createOwner = async (input: CreateOwnerFormType) => {
    await createOwnerMutation({ variables: input })
      .then(() => {
        toast({
          title: 'Success',
          description: 'Owner has been created successfully',
        });

        if (currentOrganization) {
          setCurrentOrganization({ ...currentOrganization, hasOwner: true });
        }
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
