import {
  erxesMessengerSetupGreetingAtom,
  erxesMessengerSetupHoursAtom,
} from '@/integrations/erxes-messenger/states/erxesMessengerSetupStates';
import { IconPlus, IconX } from '@tabler/icons-react';
import { Avatar, Button, Popover, readImage, Separator } from 'erxes-ui';
import { MembersInline, useMembersInlineContext } from 'ui-modules';
import { useAtomValue } from 'jotai';
import { EMGreetingAvatar } from '@/integrations/erxes-messenger/components/EMGreeting';

export const ActiveUsers = () => {
  const { members } = useMembersInlineContext();
  return (
    <div className="flex gap-2 items-center">
      {members.map((member) => (
        <Avatar key={member._id} size="xl">
          <Avatar.Image src={readImage(member.details?.avatar || '', 200)} />
          <Avatar.Fallback>
            {member.details?.fullName?.charAt(0) || ''}
          </Avatar.Fallback>
        </Avatar>
      ))}
    </div>
  );
};

export const EMPreviewIntro = () => {
  const greeting = useAtomValue(erxesMessengerSetupGreetingAtom);
  const hours = useAtomValue(erxesMessengerSetupHoursAtom);

  return (
    <>
      <div className="p-6 pt-4 pb-16 bg-primary text-primary-foreground">
        <Popover.Close asChild>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4"
          >
            <IconX />
          </Button>
        </Popover.Close>
        <div className="flex gap-1 items-center mb-2 text-accent">
          {greeting?.links?.map(
            (link) =>
              !!link && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  asChild
                  key={link.url}
                >
                  <a href={link.url} target="_blank" rel="noreferrer">
                    <EMGreetingAvatar url={link.url} />
                  </a>
                </Button>
              ),
          )}
        </div>
        <h1 className="text-2xl font-semibold">
          {greeting?.title || 'Welcome'}
        </h1>
        <p className="mt-3 mb-5 text-sm text-primary-foreground/80">
          {greeting?.message || 'Welcome to Erxes Messenger'}
        </p>
        <MembersInline.Provider memberIds={greeting?.supporterIds || []}>
          <ActiveUsers />
        </MembersInline.Provider>
      </div>
      <div className="px-4 py-6 mx-6 -mt-8 rounded-xl shadow-md bg-background">
        <div className="px-3 mb-2 text-sm font-medium text-accent-foreground">
          Recent conversations
        </div>
        <Button
          className="justify-start px-2 my-2 w-full h-auto text-left rounded-md"
          variant="ghost"
        >
          <div className="flex items-center p-2 rounded-full bg-muted text-muted-foreground">
            <IconPlus className="size-5" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col gap-1">
            <span>Start new conversation</span>
            <span className="text-xs font-normal text-accent-foreground">
              Our usual response time is a few {hours?.responseRate}.
            </span>
          </div>
        </Button>
        <Separator />
      </div>
    </>
  );
};
