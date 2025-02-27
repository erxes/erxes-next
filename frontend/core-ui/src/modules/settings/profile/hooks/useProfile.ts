import { useMutation, useQuery } from '@apollo/client';

import { currentUserState } from 'ui-modules';
import { toast, useConfirm } from 'erxes-ui/hooks';
import { useAtom } from 'jotai';
import { UpdateProfile } from '@/settings/profile/graphql/mutations/updateProfile';
import { userDetail } from '@/settings/profile/graphql/queries/userDetail';

import { iUserDetail, Props } from '../types/userDetail';

const useProfile = ({ onCompleted }: Props) => {
  const [currentUser, setCurrentUser] = useAtom(currentUserState);

  const { confirm } = useConfirm();

  const { loading, data, refetch } = useQuery(userDetail, {
    variables: { _id: currentUser?._id },
    onCompleted,
    skip: !currentUser?._id,
  });

  const [updateProfile] = useMutation(UpdateProfile);

  const profileUpdate = async (profile: Partial<iUserDetail>) => {
    const confirmOptions = { confirmationValue: 'update' };

    confirm({
      message: 'Are you sure you want to update the profile?',
      options: confirmOptions,
    }).then(async () => {
      try {
        const response = await updateProfile({ variables: { ...profile } });

        if (response.data) {
          refetch();
          setCurrentUser(response.data.updateProfile);

          toast({ title: 'Successfully updated profile' });
        }
      } catch (e: any) {
        toast({
          title: 'Error updating profile',
          description: e.message || 'An unexpected error occurred.',
        });
      }
    });
  };

  const profile = data?.userDetail || {};

  return {
    profile,
    loading,
    profileUpdate,
  };
};

export { useProfile };
