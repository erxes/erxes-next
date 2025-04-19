import {
  mutations as ChannelMutations,
  queries as ChannelQueries,
  types as ChannelTypes,
} from './channels';

export const types = `
  ${ChannelTypes}

`;

export const queries = `
  ${ChannelQueries}
`;

export const mutations = `
  ${ChannelMutations}
`;
