import { gql } from '@apollo/client';
import {
  GQL_CURSOR_PARAM_DEFS,
  GQL_CURSOR_PARAMS,
  GQL_PAGE_INFO,
} from 'erxes-ui';

export const getIntegrations = gql`
  query integrationsGetUsedTypes($limit: Int, $only: String) {
    integrationsGetUsedTypes {
      _id
      name
    }
    conversationCounts(limit: $limit, only: $only)
  }
`;

export const INTEGRATION_DETAIL = gql`
  query IntegrationDetail($id: String!) {
    integrationDetail(_id: $id) {
      _id
      kind
      brand {
        _id
        name
      }
    }
  }
`;

export const GET_INTEGRATIONS_BY_KIND = gql`
  query Integrations($kind: String, $searchValue: String, ${GQL_CURSOR_PARAM_DEFS}) {
    integrations(kind: $kind, searchValue: $searchValue, ${GQL_CURSOR_PARAMS}) {
      list {
        _id
        name
        kind
        brandId
        isActive
        healthStatus
      }
      ${GQL_PAGE_INFO}
    }
  }
`;
