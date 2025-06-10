import { gql } from '@apollo/client';

export const conformityQueryFields = `
  $mainType: String,
  $mainTypeId: String,
  $relType: String,
  $isRelated: Boolean,
  $isSaved: Boolean,
`;

export const conformityQueryFieldDefs = `
  conformityMainType: $mainType,
  conformityMainTypeId: $mainTypeId,
  conformityRelType: $relType,
  conformityIsRelated: $isRelated,
  conformityIsSaved: $isSaved,
`;

const commonParams = `
  $_ids: [String]
  $companyIds: [String],
  $customerIds: [String],
  $assignedUserIds: [String],
  $productIds: [String],
  $labelIds: [String],
  $search: String,
  $priority: [String],
  $date: SalesItemDate,
  $pipelineId: String,
  $parentId: String,
  $closeDateType: String,
  $sortField: String,
  $sortDirection: Int,
  $userIds: [String],
  $segment: String,
  $segmentData:String,
  $assignedToMe: String,
  $startDate: String,
  $endDate: String,
  $tagIds: [String],
  $noSkipArchive: Boolean
  $branchIds:[String]
  $departmentIds:[String]
  ${conformityQueryFields},
  $createdStartDate: Date,
  $createdEndDate: Date,
  $stateChangedStartDate: Date
  $stateChangedEndDate: Date
  $startDateStartDate: Date
  $startDateEndDate: Date
  $closeDateStartDate: Date
  $closeDateEndDate: Date
`;

const commonParamDefs = `
  _ids: $_ids,
  companyIds: $companyIds,
  customerIds: $customerIds,
  assignedUserIds: $assignedUserIds,
  priority: $priority,
  productIds: $productIds,
  labelIds: $labelIds,
  search: $search,
  date: $date,
  pipelineId: $pipelineId,
  parentId: $parentId,
  closeDateType: $closeDateType,
  sortField: $sortField,
  sortDirection: $sortDirection,
  userIds: $userIds,
  segment: $segment,
  segmentData: $segmentData,
  assignedToMe: $assignedToMe,
  startDate: $startDate,
  endDate: $endDate,
  tagIds: $tagIds,
  noSkipArchive: $noSkipArchive
  branchIds: $branchIds,
  departmentIds: $departmentIds,
  ${conformityQueryFieldDefs},
  createdStartDate: $createdStartDate,
  createdEndDate: $createdEndDate,
  stateChangedStartDate: $stateChangedStartDate
  stateChangedEndDate: $stateChangedEndDate
  startDateStartDate: $startDateStartDate
  startDateEndDate: $startDateEndDate
  closeDateStartDate: $closeDateStartDate
  closeDateEndDate: $closeDateEndDate
`;

export const commonListFields = `
  _id
  name
  companies
  customers
  assignedUsers
  labels
  stage
  isComplete
  isWatched
  relations
  startDate
  closeDate
  createdAt
  modifiedAt
  priority
  hasNotified
  score
  number
  tagIds
  customProperties
  status
  tags {
    _id
    name
    colorCode
  }
`;

export const deals = gql`
  query deals(
    $initialStageId: String,
    $stageId: String,
    $skip: Int,
    $limit: Int,
    ${commonParams}
  ) {
    deals(
      initialStageId: $initialStageId,
      stageId: $stageId,
      skip: $skip,
      limit: $limit,
      ${commonParamDefs}
    ) {
      products
      unUsedAmount
      amount
      ${commonListFields}
    }
  }
`;

export const itemsCountBySegments = gql`
  query salesItemsCountBySegments($type: String!, $boardId: String, $pipelineId: String) {
    salesItemsCountBySegments(type: $type, boardId: $boardId, pipelineId: $pipelineId)
  }
`;

export const itemsCountByAssignedUser = gql`
  query salesItemsCountByAssignedUser($pipelineId: String!, $type: String!, $stackBy: String) {
    salesItemsCountByAssignedUser(pipelineId: $pipelineId, type: $type, stackBy: $stackBy)
  }
`;