import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { AvatarPopoverProps } from '../types';
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
