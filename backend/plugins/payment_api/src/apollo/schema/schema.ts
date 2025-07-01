import {
  mutations as PaymentMutations,
  queries as PaymentQueries,
  types as PaymentTypes,
} from '@/payment/graphql/schemas/payment';

export const types = `
  ${PaymentTypes}
`;

export const queries = `
  ${PaymentQueries}
`;

export const mutations = `
  ${PaymentMutations}
`;

export default { types, queries, mutations };
