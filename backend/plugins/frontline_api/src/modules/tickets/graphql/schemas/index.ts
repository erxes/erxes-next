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
  mutations as ticketMutations,
  queries as ticketQueries,
  types as ticketTypes,
} from './ticket';

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

import { commonDeps } from '~/modules/tickets/graphql/schemas/common';

export const types = `
    ${commonDeps}
    ${checkListTypes}
    ${boardTypes}
    ${pipelineTypes}
    ${ticketTypes}
    ${pipelineLabelTypes}
    ${stageTypes}
`;

export const queries = `
    ${checkListQueries}
    ${boardQueries}
    ${pipelineQueries}
    ${ticketQueries}
    ${pipelineLabelQueries}
    ${stageQueries}
`;

export const mutations = `
    ${checkListMutations}
    ${boardMutations}
    ${pipelineMutations}
    ${ticketMutations}
    ${pipelineLabelMutations}
    ${stageMutations}
`;
