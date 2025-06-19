export const types = `
  type TicketsPipelineLabel @key(fields: "_id") {
    _id: String!
    name: String!
    colorCode: String
    pipelineId: String
    createdBy: String
    createdAt: Date
  }
`;

export const queries = `
  ticketsPipelineLabels(pipelineId: String, pipelineIds: [String]): [TicketsPipelineLabel]
  ticketsPipelineLabelDetail(_id: String!): TicketsPipelineLabel
`;

const mutationParams = `
  name: String!
  colorCode: String!
  pipelineId: String!
`;

export const mutations = `
  ticketsPipelineLabelsAdd(${mutationParams}): TicketsPipelineLabel
  ticketsPipelineLabelsEdit(_id: String!, ${mutationParams}): TicketsPipelineLabel
  ticketsPipelineLabelsRemove(_id: String!): JSON
  ticketsPipelineLabelsLabel(pipelineId: String!, targetId: String!, labelIds: [String!]!): String
`;
