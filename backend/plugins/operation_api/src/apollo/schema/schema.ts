import {
  mutations as TaskMutations,
  queries as TaskQueries,
  types as TaskTypes,
} from '@/task/graphql/schemas/task';

import {
  queries as ProjectQueries,
  types as ProjectTypes,
  mutations as ProjectMutations,
} from '@/project/graphql/schema/project';

import {
  queries as TeamQueries,
  types as TeamTypes,
  mutations as TeamMutations,
} from '@/team/graphql/schemas/team';

import {
  queries as StatusQueries,
  types as StatusTypes,
  mutations as StatusMutations,
} from '@/status/graphql/schema/status';

export const types = `
  ${TaskTypes}
  ${ProjectTypes}
  ${TeamTypes}
  ${StatusTypes}
`;

export const queries = `
  ${TaskQueries}
  ${ProjectQueries}
  ${TeamQueries}
  ${StatusQueries}
`;

export const mutations = `
  ${TaskMutations}
  ${ProjectMutations}
  ${TeamMutations}
  ${StatusMutations}
`;

export default { types, queries, mutations };
