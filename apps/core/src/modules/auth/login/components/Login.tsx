import {
  FormType,
  useSignInUpForm,
  validationSchema,
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

const Login = () => {
  const { form } = useSignInUpForm();

  const { submitCertencial } = useLogin();

  const submitHandler: SubmitHandler<FormType> = (data) => {
    submitCertencial(data);
  };

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

  const email = form.watch('email');
  const password = form.watch('password');

  const isEmailStepSubmitButtonDisabledCondition =
    !validationSchema.shape.email.safeParse(email).success;

  const isPasswordStepSubmitButtonDisabledCondition =
    !validationSchema.shape.password.safeParse(password).success;

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
        <Button
          type="submit"
          onClick={form.handleSubmit(submitHandler)}
          disabled={isSubmitButtonDisabled}
        >
          Sign in
        </Button>
      </form>
    </Form>
  );
};

export default Login;
