import { useCallback, useEffect, useState } from 'react';
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
  authValidationSchema,
  FormType,
  useSignInUpForm,
} from '@/auth/login/hooks/useLoginForm';

export const Login = () => {
  const { form } = useSignInUpForm();

  const { handleCrendentialsLogin, handleForgotPassword } = useLogin();

  const submitHandler: SubmitHandler<FormType> = useCallback(
    async (data) => {
      handleCrendentialsLogin(data.email, data.password);
    },
    [handleCrendentialsLogin]
  );

  const onForgotPasswordClick = (email: string) => {
    handleForgotPassword(email);
  };

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

  const email = form.watch('email');
  const password = form.watch('password');

  const isEmailStepSubmitButtonDisabledCondition =
    !authValidationSchema.shape.email.safeParse(email).success;

  const isPasswordStepSubmitButtonDisabledCondition =
    !authValidationSchema.shape.password.safeParse(password).success;

  useEffect(() => {
    setIsSubmitButtonDisabled(
      isPasswordStepSubmitButtonDisabledCondition ||
        isEmailStepSubmitButtonDisabledCondition
    );
  }, [
    isEmailStepSubmitButtonDisabledCondition,
    isPasswordStepSubmitButtonDisabledCondition,
  ]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="mx-auto grid w-[350px] gap-5"
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="email" placeholder="Enter email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

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
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitButtonDisabled}>
          Sign in
        </Button>

        {!isEmailStepSubmitButtonDisabledCondition && (
          <Button
            type="button"
            onClick={() => onForgotPasswordClick(email)}
            variant="link"
            className="text-xs text-muted-foreground hover:underline text-center block hover:text-primary"
          >
            Forgot password?
          </Button>
        )}
      </form>
    </Form>
  );
};
