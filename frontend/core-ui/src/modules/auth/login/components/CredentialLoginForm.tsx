import { useCallback} from 'react';
import { SubmitHandler } from 'react-hook-form';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
} from 'erxes-ui/components';

import { useLogin } from '@/auth/login/hooks/useLogin';
import {
  FormType,
  useSignInUpForm,
} from '@/auth/login/hooks/useLoginForm';

export const CredentialLoginForm = () => {
  const { form } = useSignInUpForm();

  const { handleCrendentialsLogin, handleForgotPassword } = useLogin();

  const submitHandler: SubmitHandler<FormType> = useCallback(
    async (data) => {
      handleCrendentialsLogin(data.email, data.password);
    },
    [handleCrendentialsLogin],
  );

  const onForgotPasswordClick = (email: string) => {
    handleForgotPassword(email);
  };


  const email = form.watch('email');

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="mx-auto grid gap-5"
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <span className="font-semibold text-sm">Email</span>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your work email"
                  className="h-8"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="password"
          render={({ field }) => (
            <FormItem>
              <span className="font-semibold text-sm">Password</span>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  className="h-8"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className={`${
            !form.formState.isValid ? 'cursor-not-allowed' : ''
          } h-8`}
        >
          Sign in
        </Button>

        <div className="flex justify-center">
          <Button
            type="button"
            onClick={() => onForgotPasswordClick(email)}
            variant="ghost"
            className="text-x hover:bg-transparent h-min w-min text-muted-foreground hover:underline text-center block hover:text-primary "
          >
            Forgot password?
          </Button>
        </div>
      </form>
    </Form>
  );
};
