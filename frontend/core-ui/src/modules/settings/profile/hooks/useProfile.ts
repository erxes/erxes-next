import { useMutation, useQuery } from '@apollo/client';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { toast, useConfirm } from 'erxes-ui/hooks';

import { UpdateProfile } from '@/settings/profile/graphql/mutations/updateProfile';
import { userDetail } from '@/settings/profile/graphql/queries/userDetail';
import { currentUserState } from 'erxes-ui-shared-states';

const useProfile = () => {
  const currentUser = useRecoilValue(currentUserState);

  const setCurrentUser = useSetRecoilState(currentUserState);

  const { confirm } = useConfirm();

  const { loading, data, refetch } = useQuery(userDetail, {
    variables: { _id: currentUser?._id },
  });

  const [updateProfile] = useMutation(UpdateProfile);

  const profileUpdate = (profile: any) => {
    const confirmOptions = {
      confirmationValue: 'update',
    };

    confirm({
      message: 'Are you sure you want to update the profile?',
      options: confirmOptions,
    }).then(async () => {
      updateProfile({ variables: { ...profile } })
        .then((response) => {
          if (response.data) {
            refetch();

            setCurrentUser(data.userDetail);

            toast({ title: 'Succesfully updated profile' });
          }
        })
        .catch((e) => {
          toast({
            title: 'Error',
            description: e.message,
          });
        });
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
