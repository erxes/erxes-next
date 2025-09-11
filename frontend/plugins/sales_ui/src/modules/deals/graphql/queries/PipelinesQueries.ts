import { gql } from '@apollo/client';

export const pipelineLabelFields = `
  _id
  name
  colorCode
  pipelineId
  createdBy
  createdAt
`;

export const GET_PIPELINE_DETAIL = gql`
  query SalesPipelineDetail($_id: ID!) {
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
  query SalesPipelineAssignedUsers($_id: ID!) {
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
  query SalesPipelineLabelDetail($_id: ID!) {
    salesPipelineLabelDetail(_id: $_id) {
      ${pipelineLabelFields}
    }
  }
`;

export const GET_PIPELINES = gql`
  query SalesPipelines($boardId: String, $isAll: Boolean) {
    salesPipelines(boardId: $boardId, isAll: $isAll) {
      _id
      name
      boardId
      state
      startDate
      endDate
      status
      createdAt
      createdUser {
        details {
          fullName
        }
      }
      itemsTotalCount
    }
  }
`;
