import { IAction, ITrigger, OptionalConnect } from 'ui-modules';

export const connectionHandler = (
  triggers: ITrigger[],
  actions: IAction[],
  info: any,
  actionId: any,
  workFlowActions: { workflowId: string; actions: IAction[] }[],
) => {
  const { sourceId, type, connectType, optionalConnectId } = info || {};

  if (type === 'trigger') {
    const trigger = triggers.find((t) => t.id.toString() === sourceId);

    if (trigger) {
      trigger.actionId = actionId;

      if (info?.workflowId) {
        trigger.workflowId = info.workflowId;
      }
    }
  } else {
    const sourceAction = actions.find((a) => a.id.toString() === sourceId);

    if (sourceAction) {
      if (sourceAction.type === 'if') {
        if (!sourceAction.config) {
          sourceAction.config = {};
        }

        const [sourceHandle] = info.sourceHandle.split('-');

        sourceAction.config[sourceHandle] = actionId;
      }

      if (connectType === 'optional') {
        const sourceConfig = sourceAction?.config || {};

        const optionalConnects = sourceConfig?.optionalConnects || [];

        //update optionalConnects if optional connect exists in sourceAction
        let updatedOptionalConnects = optionalConnects.map(
          (optConnect: OptionalConnect) =>
            optConnect.sourceId === sourceId &&
            optConnect.optionalConnectId === info.optionalConnectId
              ? { ...optConnect, actionId }
              : optConnect,
        );

        // add optionalConnect if optional connect not exists in sourceAction
        if (
          !optionalConnects.some(
            (optConnect: OptionalConnect) =>
              optConnect.sourceId === sourceId &&
              optConnect.optionalConnectId === info?.optionalConnectId,
          )
        ) {
          updatedOptionalConnects.push({
            sourceId,
            actionId,
            optionalConnectId: info?.optionalConnectId,
          });
        }

        // disconnect optionalConnect if optional connect exists in sourceAction but info.optionalConnectId is undefined

        if (
          optionalConnects.some(
            (optConnect: OptionalConnect) =>
              optConnect.sourceId === sourceId &&
              optConnect.optionalConnectId === optionalConnectId,
          )
        ) {
          updatedOptionalConnects = optionalConnects.filter(
            (optConnect: OptionalConnect) =>
              optConnect.optionalConnectId !== optionalConnectId,
          );
        }

        sourceAction.config = {
          ...sourceConfig,
          optionalConnects: updatedOptionalConnects,
        };
      } else {
        sourceAction.nextActionId = actionId;
      }
    }

    const workflow = workFlowActions.find(
      ({ workflowId, actions }) =>
        workflowId === info?.workflowId &&
        actions.some(({ id }) => id.toString() === sourceId),
    );

    if (workflow) {
      const sourceAction = actions.find(({ id }) => id === workflow.workflowId);

      if (sourceAction) {
        sourceAction.config = {
          ...(sourceAction.config || {}),
          workflowConnection: { sourceId, targetId: actionId },
        };
      }
    }
  }

  return { triggers, actions };
};

export const generateConnect = (params: any, source: any) => {
  const { sourceHandle } = params;

  let info: any = {
    ...params,
    sourceId: params.source,
    targetId: params.target,
    type: source?.data?.nodeType,
  };

  if (sourceHandle) {
    if (params?.sourceHandle.includes(params?.source)) {
      const [_sourceId, optionalConnectId] = params.sourceHandle.split('-');
      info.optionalConnectId = optionalConnectId;
      info.connectType = 'optional';
    }
  }

  // const targetWorkflow = workFlowActions?.find(({ actions }) =>
  //   actions.some(action => action.id === info.targetId)
  // );
  // if (targetWorkflow) {
  //   info.workflowId = targetWorkflow.workflowId;
  // }

  // const sourceWorkflow = workFlowActions?.find(({ actions }) =>
  //   actions.some(action => action.id === info.sourceId)
  // );

  // if (sourceWorkflow && info.targetId) {
  //   info.workflowId = sourceWorkflow.workflowId;
  // }

  return info;
};

export const getNewId = (checkIds: string[]) => {
  let newId = Math.random().toString(36).slice(-8);

  if (checkIds.includes(newId)) {
    newId = getNewId(checkIds);
  }

  return newId;
};
