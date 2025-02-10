import { Button } from 'erxes-ui/components';

import { GoogleLogo } from '@/auth/components/GoogleLogo';
export const GoogleOAuthButton = () => {
  const handleClick = () => {
    console.log();
  };
  return (
    <Button
      variant={'outline'}
      className="flex shadow-button-outline h-8"
      onClick={handleClick}
    >
      <GoogleLogo />
      <span className="text-sm font-semibold">Continue with google</span>
    </Button>
  );
};
