const commonFields = `
  name: String
  status: String
  triggers: [TriggerInput],
  actions: [ActionInput],
`;

const commonNoteFields = `
  automationId: String
  triggerId: String
  actionId: String
  description: String
`;

const mutations = `
  automationsAdd(${commonFields}): Automation
  automationsEdit(_id: ID, ${commonFields}): Automation
  automationsRemove(automationIds: [String]): [String]
  archiveAutomations(automationIds: [String],isRestore:Boolean): [String]

  automationsSaveAsTemplate(_id: ID!, name: String, duplicate: Boolean): Automation
  automationsCreateFromTemplate(_id: ID): Automation

  automationsAddNote(${commonNoteFields}): AutomationNote
  automationsEditNote(_id: ID!, ${commonNoteFields}): AutomationNote
  automationsRemoveNote(_id: ID!): AutomationNote
`;

export default mutations;
