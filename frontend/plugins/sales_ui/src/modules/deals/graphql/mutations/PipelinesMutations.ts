import { gql } from "@apollo/client";

export const ADD_PIPELINE_LABEL = gql`
  mutation SalesPipelineLabelsAdd($name: String!, $colorCode: String!, $pipelineId: String!) {
    salesPipelineLabelsAdd(name: $name, colorCode: $colorCode, pipelineId: $pipelineId) {
      _id
    }
  }
`;

export const EDIT_PIPELINE_LABEL = gql`
  mutation SalesPipelineLabelsEdit($_id: String!, $name: String!, $colorCode: String!, $pipelineId: String!) {
    salesPipelineLabelsEdit(_id: $_id, name: $name, colorCode: $colorCode, pipelineId: $pipelineId) {
      _id
    }
  }
`;

export const REMOVE_PIPELINE_LABEL = gql`
  mutation SalesPipelineLabelsRemove($_id: String!) {
    salesPipelineLabelsRemove(_id: $_id)
  }
`;

export const LABEL_PIPELINE_LABEL = gql`
  mutation SalesPipelineLabelsLabel($targetId: String!, $labelIds: [String!]!) {
    salesPipelineLabelsLabel(targetId: $targetId, labelIds: $labelIds)
  }
`;