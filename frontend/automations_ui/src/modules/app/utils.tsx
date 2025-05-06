import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
export const maskFields = (data: any, keysToMask: string[]): any => {
  if (Array.isArray(data)) {
    return data.map((item) => maskFields(item, keysToMask));
  } else if (typeof data === 'object' && data !== null) {
    return Object.entries(data).reduce((acc: any, [key, value]) => {
      if (keysToMask.includes(key)) {
        acc[key] = '••••••';
      } else {
        acc[key] = maskFields(value, keysToMask);
      }
      return acc;
    }, {});
  }

  return data;
};

export function AvatarPopover({ user, size }: AvatarPopoverProps) {
  if (!user) {
    return '-';
  }

  const getUserName = (user: any) => {
    const { firstName, lastName } = user?.details || {};
    if (firstName || lastName) {
      return `${firstName || ''} ${lastName || ''}`;
    }
    return user?.email || '';
  };

  const userName = getUserName(user);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.details?.avatar} alt={user?.email} />
              <AvatarFallback>{userName?.[0]}</AvatarFallback>
            </Avatar>
          </div>
        </TooltipTrigger>
        <TooltipContent>{userName}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
