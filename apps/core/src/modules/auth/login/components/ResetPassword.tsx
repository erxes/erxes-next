import {
  FormType,
  useSignInUpForm,
  resedPasswordValidationSchema,
} from '@/auth/login/hooks/useLoginForm';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
} from 'erxes-ui';
import { SubmitHandler } from 'react-hook-form';
import { useLogin } from '@/auth/login/hooks/useLogin';
import { useEffect, useState } from 'react';

const ResetPassword = ({ token }: { token: string }) => {
  const { form } = useSignInUpForm();

  const { handleResetPassword } = useLogin();

  const submitHandler: SubmitHandler<FormType> = (data) => {
    handleResetPassword(token, data.password);
  };

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

  const password = form.watch('password');

  const isPasswordStepSubmitButtonDisabledCondition =
    !resedPasswordValidationSchema.shape.password.safeParse(password).success;

  useEffect(() => {
    setIsSubmitButtonDisabled(isPasswordStepSubmitButtonDisabledCondition);
  }, [isPasswordStepSubmitButtonDisabledCondition]);

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
            </FormItem>
          )}
        />
        <Button
          type="submit"
          onClick={form.handleSubmit(submitHandler)}
          disabled={isSubmitButtonDisabled}
        >
          Change password
        </Button>
      </form>
    </Form>
  );
};

export default ResetPassword;
