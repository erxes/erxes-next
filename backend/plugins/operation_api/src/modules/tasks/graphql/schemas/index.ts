import {
  mutations as boardMutations,
  queries as boardQueries,
  types as boardTypes,
} from './board';

import {
  mutations as pipelineMutations,
  queries as pipelineQueries,
  types as pipelineTypes,
} from './pipeline';

import {
  mutations as checkListMutations,
  queries as checkListQueries,
  types as checkListTypes,
} from './checklist';

import {
  mutations as taskMutations,
  queries as taskQueries,
  types as taskTypes,
} from './task';

import {
  mutations as pipelineLabelMutations,
  queries as pipelineLabelQueries,
  types as pipelineLabelTypes,
} from './label';

import {
  mutations as stageMutations,
  queries as stageQueries,
  types as stageTypes,
} from './stage';

export const types = `
    ${checkListTypes}
    ${boardTypes}
    ${pipelineTypes}
    ${taskTypes}
    ${pipelineLabelTypes}
    ${stageTypes}
`;

export const queries = `
    ${checkListQueries}
    ${boardQueries}
    ${pipelineQueries}
    ${taskQueries}
    ${pipelineLabelQueries}
    ${stageQueries}
`;

export const mutations = `
    ${checkListMutations}
    ${boardMutations}
    ${pipelineMutations}
    ${taskMutations}
    ${pipelineLabelMutations}
    ${stageMutations}
`;
