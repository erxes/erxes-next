export const types = `
  type SalesChecklistItem {
    _id: ID!
    checklistId: String
    isChecked: Boolean
    content: String
    order: Int
  }

  type SalesChecklist {
    _id: ID!
    contentType: String
    contentTypeId: String
    title: String
    createdUserId: String
    createdDate: Date
    items: [SalesChecklistItem]
    percent: Float
  }

`;

export const queries = `
  salesChecklists(contentTypeId: String): [SalesChecklist]
  salesChecklistDetail(_id: ID!): SalesChecklist
`;

export const mutations = `
  salesChecklistsAdd(contentTypeId: String, title: String): SalesChecklist
  salesChecklistsEdit(_id: ID!, title: String, contentTypeId: String,): SalesChecklist
  salesChecklistsRemove(_id: ID!): SalesChecklist
  salesChecklistItemsOrder(_id: ID!, destinationIndex: Int): SalesChecklistItem

  salesChecklistItemsAdd(checklistId: String, content: String, isChecked: Boolean): SalesChecklistItem
  salesChecklistItemsEdit(_id: ID!, checklistId: String, content: String, isChecked: Boolean): SalesChecklistItem
  salesChecklistItemsRemove(_id: ID!): SalesChecklistItem
`;
