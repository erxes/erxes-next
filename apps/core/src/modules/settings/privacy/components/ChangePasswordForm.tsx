import { IconEye, IconEyeOff } from '@tabler/icons-react';
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from 'erxes-ui/components';
import { useCallback } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useChangePassword } from '../hooks/useChangePassword';
import {
  FormType,
  useChangePasswordForm,
} from '../hooks/useChangePasswordForm';

const ChangePasswordForm = () => {
  const { form } = useChangePasswordForm();

  const { passwordChange } = useChangePassword();

  const submitHandler: SubmitHandler<FormType> = useCallback(
    async (data) => {
      const { currentPassword, password } = data;

      passwordChange({ currentPassword, newPassword: password });
    },
    [passwordChange]
  );

  const renderInput = ({ name, icons }) => {
    const { control, watch, setValue } = form;

    const showField = `${name}Show` as keyof FormType;

    const isVisible = watch(showField);

    const Icon = isVisible ? icons.hide : icons.show;

    const handleIconClick = () => {
      setValue(showField, !isVisible);
    };

    return (
      <>
        <FormField
          name={name}
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type={watch(showField) ? 'text' : 'password'}
                  className="pr-10"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Icon
          onClick={handleIconClick}
          className="cursor-pointer absolute right-2 top-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </>
    );
  };

  return (
    <Form {...form}>
      <form className="grid gap-5" onSubmit={form.handleSubmit(submitHandler)}>
        <div className="flex flex-col gap-3">
          <FormLabel>Change Password</FormLabel>
          <FormDescription>
            Change password for enhaced account security.
          </FormDescription>
        </div>
        <div className="flex flex-col gap-3 mx-0.5">
          <div className="flex flex-col gap-2">
            <FormLabel className="text-xs">Current password</FormLabel>
            <div className="relative group">
              {renderInput({
                name: 'currentPassword',
                icons: { show: IconEye, hide: IconEyeOff },
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <FormLabel className="text-xs">New password</FormLabel>
            <div className="relative group">
              {renderInput({
                name: 'password',
                icons: { show: IconEye, hide: IconEyeOff },
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <FormLabel className="text-xs">Re-type new password</FormLabel>
            <div className="relative group">
              {renderInput({
                name: 'confirmPassword',
                icons: { show: IconEye, hide: IconEyeOff },
              })}
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end">
          <Button type="submit" size="sm">
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ChangePasswordForm;
