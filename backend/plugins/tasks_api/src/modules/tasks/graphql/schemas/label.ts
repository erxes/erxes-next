export const types = `
  type TasksPipelineLabel @key(fields: "_id") {
    _id: String!
    name: String!
    colorCode: String
    pipelineId: String
    createdBy: String
    createdAt: Date
  }
`;

export const queries = `
  tasksPipelineLabels(pipelineId: String, pipelineIds: [String]): [TasksPipelineLabel]
  tasksPipelineLabelDetail(_id: String!): TasksPipelineLabel
`;

const mutationParams = `
  name: String!
  colorCode: String!
  pipelineId: String!
`;

export const mutations = `
  tasksPipelineLabelsAdd(${mutationParams}): TasksPipelineLabel
  tasksPipelineLabelsEdit(_id: String!, ${mutationParams}): TasksPipelineLabel
  tasksPipelineLabelsRemove(_id: String!): JSON
  tasksPipelineLabelsLabel(pipelineId: String!, targetId: String!, labelIds: [String!]!): String
`;

