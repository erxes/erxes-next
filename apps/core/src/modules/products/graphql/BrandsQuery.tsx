import { gql } from '@apollo/client'


export const brandsQuery = gql`
query brands($page: Int, $perPage: Int, $searchValue: String) {
  brands(page: $page, perPage: $perPage, searchValue: $searchValue) {
    _id
    code
    name
    createdAt
    description
    emailConfig
    __typename
  }
}`
