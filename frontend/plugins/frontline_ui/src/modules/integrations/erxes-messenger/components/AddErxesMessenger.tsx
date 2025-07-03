import { IconPlus } from '@tabler/icons-react';
import { Button, Preview, Resizable, Separator, Sheet } from 'erxes-ui';
import { FrontlinePaths } from '@/types/FrontlinePaths';
import { erxesMessengerSetupStepAtom } from '@/integrations/erxes-messenger/states/erxesMessengerSetupStates';
import { EMAppearance } from '@/integrations/erxes-messenger/components/EMAppearance';
import { EMGreeting } from '@/integrations/erxes-messenger/components/EMGreeting';
import { EMIntro } from '@/integrations/erxes-messenger/components/EMIntro';
import { useAtomValue } from 'jotai';
import { EMHoursAvailability } from '@/integrations/erxes-messenger/components/EMHoursAvailability';

export const AddErxesMessengerSheet = () => {
  const step = useAtomValue(erxesMessengerSetupStepAtom);
  return (
    <Sheet>
      <div>
        <Sheet.Trigger asChild>
          <Button>
            <IconPlus />
            Add Messenger
          </Button>
        </Sheet.Trigger>
      </div>

      <Sheet.View
        className="gap-0 flex-col flex sm:max-w-none md:w-[calc(100vw-theme(spacing.4))]"
        aria-describedby=""
      >
        <Sheet.Header>
          <Sheet.Title>Add Erxes Messenger</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>
        <Resizable.PanelGroup direction="horizontal">
          <Resizable.Panel className="flex flex-col" defaultSize={40}>
            {step === 1 && <EMAppearance />}
            {step === 2 && <EMGreeting />}
            {step === 3 && <EMIntro />}
            {step === 4 && <EMHoursAvailability />}
          </Resizable.Panel>
          <Resizable.Handle />
          <Resizable.Panel className="flex flex-col h-full" defaultSize={60}>
            <Preview>
              <div className="bg-background">
                <Preview.Toolbar
                  path={
                    '/settings/inbox' +
                    FrontlinePaths.ErxesMessengerPreview +
                    '?inPreview=true'
                  }
                />
              </div>
              <Separator />
              <Preview.View
                iframeSrc={
                  '/settings/inbox' +
                  FrontlinePaths.ErxesMessengerPreview +
                  '?inPreview=true'
                }
              />
            </Preview>
          </Resizable.Panel>
        </Resizable.PanelGroup>
      </Sheet.View>
    </Sheet>
  );
};
