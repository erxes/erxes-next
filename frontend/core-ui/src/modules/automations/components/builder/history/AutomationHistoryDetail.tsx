import { IAutomationHistory } from '@/automations/types';
import {
  IconAutomaticGearbox,
  IconEye,
  IconTournament,
} from '@tabler/icons-react';
import {
  Button,
  RecordTable,
  RecordTableCellDisplay,
  Sheet,
  Tabs,
} from 'erxes-ui';
import { AutomationHistoryByFlow } from './AutomationHistoryByFlow';
import { IAction, ITrigger } from 'ui-modules';
import { AutomationHistoryByTable } from './AutomationHistoryByTable';

export const AutomationHistoryDetail = ({
  history,
  constants,
}: {
  history: IAutomationHistory;
  constants: { triggersConst: ITrigger[]; actionsConst: IAction[] };
}) => {
  return (
    <RecordTableCellDisplay>
      <Sheet>
        <Sheet.Trigger asChild>
          <RecordTable.MoreButton className="w-full h-full">
            <IconEye />
          </RecordTable.MoreButton>
        </Sheet.Trigger>
        <Sheet.View className="p-0 md:w-[calc(100vw-theme(spacing.4))] flex flex-col gap-0 transition-all duration-100 ease-out overflow-hidden flex-none sm:max-w-screen-2xl">
          <Tabs defaultValue="table" className="h-full">
            <Tabs.List className="w-full">
              <div className="flex-1 flex flex-row justify-center">
                <Tabs.Trigger value="table">
                  <IconAutomaticGearbox />
                  View as table
                </Tabs.Trigger>
                <Tabs.Trigger value="flow">
                  <IconTournament className="scale-x-[-1]" />
                  View as flow
                </Tabs.Trigger>
              </div>
              <Sheet.Close />
            </Tabs.List>
            <Tabs.Content value="flow" className="h-[calc(100%-36px)]">
              <AutomationHistoryByFlow
                history={history}
                constants={constants}
              />
            </Tabs.Content>

            <Tabs.Content value="table" className="h-[calc(100%-36px)]">
              <AutomationHistoryByTable
                history={history}
                constants={constants}
              />
            </Tabs.Content>
          </Tabs>
        </Sheet.View>
      </Sheet>
    </RecordTableCellDisplay>
  );
};
