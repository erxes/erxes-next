export const types = `
  type SalesPipelineLabel @key(fields: "_id") {
    _id: ID!
    name: String!
    colorCode: String
    pipelineId: String
    createdBy: String
    createdAt: Date
  }
`;

export const queries = `
  salesPipelineLabels(pipelineId: String, pipelineIds: [String]): [SalesPipelineLabel]
  salesPipelineLabelDetail(_id: ID!): SalesPipelineLabel
`;

const mutationParams = `
  name: String!
  colorCode: String!
  pipelineId: String!
`;

export const mutations = `
  salesPipelineLabelsAdd(${mutationParams}): SalesPipelineLabel
  salesPipelineLabelsEdit(_id: ID!, ${mutationParams}): SalesPipelineLabel
  salesPipelineLabelsRemove(_id: ID!): JSON
  salesPipelineLabelsLabel(targetId: String!, labelIds: [String!]!): String
`;
