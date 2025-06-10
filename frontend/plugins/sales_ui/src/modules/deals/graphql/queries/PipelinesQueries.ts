import { gql } from "@apollo/client";

export const pipelineLabelFields = `
  _id
  name
  colorCode
  pipelineId
  createdBy
  createdAt
`;

export const pipelineDetail = gql`
  query salesPipelineDetail($_id: String!) {
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

export const pipelineLabels = gql`
  query salesPipelineLabels($pipelineId: String!) {
    salesPipelineLabels(pipelineId: $pipelineId) {
      ${pipelineLabelFields}
    }
  }
`;

export const pipelineAssignedUsers = gql`
  query salesPipelineAssignedUsers($_id: String!) {
    salesPipelineAssignedUsers(_id: $_id) {
      _id
      details {
        avatar
        fullName
      }
    }
  }
`;

export const pipelineLabelDetail = gql`
  query salesPipelineLabelDetail($_id: String!) {
    salesPipelineLabelDetail(_id: $_id) {
      ${pipelineLabelFields}
    }
  }
`;
    
