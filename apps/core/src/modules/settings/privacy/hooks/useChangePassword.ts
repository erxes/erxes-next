import { usersChangePassword } from '@/settings/privacy/graphql/mutations/changePassword';
import { useMutation } from '@apollo/client';
import { toast, useConfirm } from 'erxes-ui/hooks';

const useChangePassword = () => {
  const { confirm } = useConfirm();

  const [changePassword] = useMutation(usersChangePassword);

  const passwordChange = ({ currentPassword, newPassword }) => {
    const confirmOptions = {
      confirmationValue: 'change',
    };

    confirm({
      message: 'Are you sure you want to change the password?',
      options: confirmOptions,
    }).then(async () => {
      changePassword({ variables: { currentPassword, newPassword } })
        .then((response) => {
          if (response.data) {
            toast({ title: 'Succesfully changed password' });
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

  return {
    passwordChange,
  };
};

export { useChangePassword };
