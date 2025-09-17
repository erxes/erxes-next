import gql from 'graphql-tag';

export const types = gql`
  type Config {
    _id: ID
    name: String
    value: String
    contractId: ID
  }
`;

export const queries = gql`
  getConfigs($name: String, $contractId: String): [Config]
`;

export const mutations = gql`
  createConfig(name: String!, value: String!, contractId: ID): Config
  updateConfig(name: String!, value: String!, contractId: ID): Config
  removeConfig(name: String!): Config
`;
