import {
  ResetPasswordFormType,
  useResetPasswordForm,
} from '@/auth/login/hooks/useLoginForm';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from 'erxes-ui/components';
import { SubmitHandler } from 'react-hook-form';
import { useLogin } from '@/auth/login/hooks/useLogin';

const ResetPassword = ({ token }: { token: string }) => {
  const { form } = useResetPasswordForm();

  const { handleResetPassword } = useLogin();

  const submitHandler: SubmitHandler<ResetPasswordFormType> = (data) => {
    handleResetPassword(token, data.password);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="mx-auto grid w-[350px] gap-5"
      >
        <FormField
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" onClick={form.handleSubmit(submitHandler)}>
          Change password
        </Button>
      </form>
    </Form>
  );
};

export default ResetPassword;
