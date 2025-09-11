export const queries = `
    clientPortalGetVercelDomains(_id: ID!): JSON
    clientPortalGetVercelDomainConfig(domain: String!): JSON
    clientPortalGetVercelDeploymentStatus(_id: ID!): JSON
`;

export const mutations = `
    clientPortalDeployVercel(_id: ID!): JSON
    clientPortalRemoveVercel(_id: ID!): Boolean
    clientPortalAddDomainToVercel(_id: ID!, domain: String): JSON
`;
