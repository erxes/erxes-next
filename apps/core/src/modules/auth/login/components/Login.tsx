import { FormType, useSignInUpForm } from '@/auth/login/hooks/useLoginForm';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from 'erxes-ui';
import { SubmitHandler } from 'react-hook-form';
import { useLogin } from '@/auth/login/hooks/useLogin';

const Login = () => {
  const { form } = useSignInUpForm();

  const { submitCertencial } = useLogin(form);

  const submitHandler: SubmitHandler<FormType> = (data) => {
    submitCertencial(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)}>
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="email" placeholder="Enter email" {...field} />
              </FormControl>

              <FormMessage />
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

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" onClick={form.handleSubmit(submitHandler)}>
          Sign in
        </Button>
      </form>
    </Form>
  );
};

export default Login;
