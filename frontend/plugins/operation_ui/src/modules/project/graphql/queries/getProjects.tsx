import gql from 'graphql-tag';
import { GQL_PAGE_INFO } from 'erxes-ui';

export const GET_PROJECTS = gql`
  query GetProjects(
    $filter: IProjectFilter
  ) {
    getProjects(
      filter: $filter
    ) {
      list {
        _id
        name
        icon
        status
        priority
        teamIds
        leadId
        startDate
        targetDate
        createdAt
        updatedAt
      } 
      ${GQL_PAGE_INFO}
    }
  }
`;
