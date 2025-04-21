import { TypeExtensions } from '../../modules/inbox/graphql/schemas/extensions';
import {
  mutations as ChannelsMutations,
  queries as ChannelsQueries,
  types as ChannelsTypes,
} from '@/inbox/graphql/schemas/channels';

export const types = `
    ${TypeExtensions}
    ${ChannelsTypes}
  `;
export const queries = `
    ${ChannelsQueries}
  `;

export const mutations = `
   ${ChannelsMutations}
`;
export default { types, queries, mutations };
