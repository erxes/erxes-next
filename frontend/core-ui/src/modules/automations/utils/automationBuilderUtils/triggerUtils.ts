import { IAction, ITrigger } from 'ui-modules';

export const getContentType = (
  currentActionId: string,
  actions: IAction[],
  triggers: ITrigger[],
): ITrigger | undefined => {
  const trigger = triggers.find((t) => t.actionId === currentActionId);
  if (trigger) {
    return trigger;
  }

  // Find the parent action that leads to this current action
  const parentAction = actions.find((a) => a.nextActionId === currentActionId);
  if (parentAction) {
    // Recursively call the function with the parent action
    return getContentType(parentAction.id, actions, triggers);
  }

  // Fallback if nothing found in the chain
  return triggers[0];
};
/**
 * Finds the trigger type associated with a given action by walking backward
 * through the actions chain from the current action ID.
 *
 * @param currentActionId - The ID of the current action to start the search from.
 * @param actions - Array of all actions, each possibly linking to the next via `nextActionId`.
 * @param triggers - Array of triggers, each associated with an action by `actionId`.
 * @returns The type of the trigger corresponding to the current or previous linked action,
 *          or `undefined` if no matching trigger is found.
 */
export const getTriggerOfAction = (
  currentActionId: string,
  actions: IAction[],
  triggers: ITrigger[],
) => {
  // Build a map of nextActionId → actionId
  const reverseMap = new Map<string, string>();

  for (const { id, nextActionId } of actions) {
    if (nextActionId) {
      reverseMap.set(nextActionId, id);
    }
  }

  let cursor = currentActionId;

  // Walk backward
  while (cursor) {
    const trigger = triggers.find((t) => t.actionId === cursor);
    if (trigger) return trigger.type;

    cursor = reverseMap.get(cursor) ?? '';
  }

  return undefined;
};

export const deepCleanNulls = (input: any): any => {
  if (Array.isArray(input)) {
    return input.map(deepCleanNulls);
  } else if (input && typeof input === 'object') {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [
        key,
        value === null ? undefined : deepCleanNulls(value),
      ]),
    );
  }
  return input;
};
