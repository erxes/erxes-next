import { RecordTable } from 'erxes-ui';
import { AutomationBotSheetForm } from '~/widgets/automations/modules/facebook/components/bots/components/AutomationBotSheetForm';
import { automationFacebookBotsColumns } from '~/widgets/automations/modules/facebook/components/bots/components/automationFacebookBotsColumns';
import { useAutomationBotsRecordTable } from '~/widgets/automations/modules/facebook/components/bots/hooks/useAutomationBotsRecordTable';

export const AutomationBotsRecordTable = () => {
  const { facebookMessengerBots } = useAutomationBotsRecordTable();

  return (
    <>
      <AutomationBotSheetForm />
      <RecordTable.Provider
        columns={automationFacebookBotsColumns}
        data={facebookMessengerBots || []}
      >
        <RecordTable.Scroll>
          <RecordTable className="w-full">
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.RowList />
            </RecordTable.Body>
          </RecordTable>
        </RecordTable.Scroll>
      </RecordTable.Provider>
    </>
  );
};
