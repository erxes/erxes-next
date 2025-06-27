import {
  IAutomationHistory,
  IAutomationHistoryAction,
} from '@/automations/types';
import { RelativeDateDisplay, Table } from 'erxes-ui';
import { IAction, ITrigger } from 'ui-modules';
import { SendEmail } from '../nodes/actions/sendEmail/components/SendEmail';
import { format } from 'date-fns';

export const generateActionResult = (action: IAutomationHistoryAction) => {
  if (action.actionType === 'delay') {
    const { value, type } = action?.actionConfig || {};
    return `Delaying for: ${value} ${type}s`;
  }

  if (!action.result) {
    return 'Result has not been recorded yet';
  }

  const { result } = action;

  if (result.error) {
    return result.error;
  }

  if (action.actionType === 'setProperty') {
    return `Update for ${(result.result || []).length} ${result.module}: ${
      result.fields || ''
    }, (${(result?.result || []).map((r: any) => (r.error && r.error) || '')})`;
  }

  if (action.actionType === 'if') {
    return `Condition: ${result.condition}`;
  }

  if (action.actionType === 'sendEmail') {
    return <SendEmail.ActionResult result={result} />;
  }

  // const Component = renderDynamicComponent(
  //   {
  //     action,
  //     result: action.result,
  //     componentType: 'historyActionResult'
  //   },
  //   action.actionType
  // );

  // if (Component) {
  //   return Component;
  // }

  return JSON.stringify(result);
};

export const AutomationHistoryByTable = ({
  constants,
  history,
}: {
  history: IAutomationHistory;
  constants: { triggersConst: ITrigger[]; actionsConst: IAction[] };
}) => {
  const { actionsConst } = constants;
  const { actions = [] } = history;

  return (
    <div className="px-4">
      <Table>
        <Table.Header className="[&_th]:w-40">
          <Table.Row>
            <Table.Head className="!w-36">Time</Table.Head>
            <Table.Head className="!w-64">Action Type</Table.Head>
            <Table.Head>Results</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {actions.map((action) => {
            return (
              <Table.Row key={action.actionId}>
                <Table.Cell>
                  <RelativeDateDisplay.Value
                    value={
                      action.createdAt
                        ? format(
                            new Date(action.createdAt),
                            'YYYY-MM-DD HH:mm:ss',
                          )
                        : 'N/A'
                    }
                  />
                </Table.Cell>
                <Table.Cell>
                  {actionsConst.find(({ type }) => type === action.actionType)
                    ?.label || 'Empty'}
                </Table.Cell>
                <Table.Cell className="overflow-x-auto">
                  {generateActionResult(action)}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};
