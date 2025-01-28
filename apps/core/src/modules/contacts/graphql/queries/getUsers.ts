import { gql } from "@apollo/client";

export const GET_USERS = gql`query users($page: Int, $perPage: Int, $status: String, $excludeIds: Boolean, $searchValue: String, $isActive: Boolean, $ids: [String], $brandIds: [String], $departmentId: String, $unitId: String, $isAssignee: Boolean, $branchId: String, $departmentIds: [String], $branchIds: [String], $segment: String, $segmentData: String) {
  users(
    page: $page
    perPage: $perPage
    status: $status
    excludeIds: $excludeIds
    searchValue: $searchValue
    isActive: $isActive
    ids: $ids
    brandIds: $brandIds
    departmentId: $departmentId
    unitId: $unitId
    branchId: $branchId
    isAssignee: $isAssignee
    departmentIds: $departmentIds
    branchIds: $branchIds
    segment: $segment
    segmentData: $segmentData
  ) {
    _id
    details {
      avatar
      fullName
    }
  }
}`