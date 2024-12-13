import { useMutation, useQuery } from '@apollo/client';
import { UpdateProfile } from '@/settings/profile/graphql/mutations/updateProfile';
import { toast } from 'erxes-ui/hooks';
import { userDetail } from '@/settings/profile/graphql/queries/userDetail';
import { useRecoilValue } from 'recoil';
import { currentUserState } from 'erxes-shared-states';
import { useConfirm } from 'erxes-ui/hooks';

const useProfile = () => {
    const currentUser = useRecoilValue(currentUserState);

    const { confirm } = useConfirm()

    const {
        loading,
        data,
        refetch,
    } = useQuery(userDetail, {
        variables: { _id: currentUser?._id },
    });

    const [updateProfile] = useMutation(UpdateProfile);

    const profileUpdate = (profile) => {

        const confirmOptions = {
            confirmationValue: 'update'
        }

        confirm({ message: 'Are you sure you want to update the profile?', options: confirmOptions }).then(async () => {
            updateProfile({ variables: { ...profile } }).then((response) => {
                if (response.data) {
                    refetch();

                    toast({ title: 'Succesfully updated profile' });
                }
            }).catch((e) => {
                toast({
                    title: 'Error',
                    description: e.message,
                });
            });
        });
    }

    return {
        profile: data?.userDetail || {},
        loading,
        refetch,
        profileUpdate
    }
}

export {
    useProfile,
}