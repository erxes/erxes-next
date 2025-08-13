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
import {
  queries as NoteQueries,
  types as NoteTypes,
  mutations as NoteMutations,
} from '@/note/graphql/schemas/note';

export const types = `
  ${TaskTypes}
  ${ProjectTypes}
  ${TeamTypes}
  ${StatusTypes}
  ${NoteTypes}
`;

export const queries = `
  ${TaskQueries}
  ${ProjectQueries}
  ${TeamQueries}
  ${StatusQueries}
  ${NoteQueries}
`;

export const mutations = `
  ${TaskMutations}
  ${ProjectMutations} 
  ${TeamMutations}
  ${StatusMutations}
  ${NoteMutations}
`;

export default { types, queries, mutations };
