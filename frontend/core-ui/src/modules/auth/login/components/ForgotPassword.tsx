import { Card } from 'erxes-ui';
import { ForgotPasswordForm } from './ForgotPasswordForm';
export const ForgotPassword = () => {
  return (
    <Card className="shadow-xl border-none p-6 mt-10 bg-background">
      <div className="w-full h-full">
        <Card.Header className="flex flex-col items-center p-3">
          {' '}
          <Card.Title className="mt-2 md:mt-3 mb-1">
            Forgot password?
          </Card.Title>
          <Card.Description className="text-center">
            Please enter your email address below to receive a password reset
            link
          </Card.Description>
        </Card.Header>
        <Card.Content className="flex-grow p-0">
          <ForgotPasswordForm />
        </Card.Content>
      </div>
      <Card.Footer className="flex flex-col text-muted-foreground p-3 md:p-4 space-y-1">
        <span className="text-xs sm:text-sm font-medium text-center">
          By signing in, you confirm that you accept our
          <a className="text-primary font-semibold hover:underline" href="#">
            Terms of use
          </a>{' '}
          and{' '}
          <a className="text-primary font-semibold hover:underline" href="#">
            Privacy policy
          </a>
        </span>
      </Card.Footer>
    </Card>
  );
};
