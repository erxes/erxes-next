import { gql } from "@apollo/client";

export const pipelineLabelFields = `
  _id
  name
  colorCode
  pipelineId
  createdBy
  createdAt
`;

export const GET_PIPELINE_DETAIL = gql`
  query SalesPipelineDetail($_id: String!) {
    salesPipelineDetail(_id: $_id) {
      _id
      name
      bgColor
      isWatched
      hackScoringType
      tagId
      initialCategoryIds
      excludeCategoryIds
      excludeProductIds
      paymentIds
      paymentTypes
      erxesAppToken
    }
  }
`;

export const GET_PIPELINE_LABELS = gql`
  query SalesPipelineLabels($pipelineId: String!) {
    salesPipelineLabels(pipelineId: $pipelineId) {
      ${pipelineLabelFields}
    }
  }
`;

export const GET_PIPELINE_ASSIGNED_USERS = gql`
  query SalesPipelineAssignedUsers($_id: String!) {
    salesPipelineAssignedUsers(_id: $_id) {
      _id
      details {
        avatar
        fullName
      }
    }
  }
`;

export const GET_PIPELINE_LABEL_DETAIL = gql`
  query SalesPipelineLabelDetail($_id: String!) {
    salesPipelineLabelDetail(_id: $_id) {
      ${pipelineLabelFields}
    }
  }
`;
    
