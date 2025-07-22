import { boardMutations } from './board';
import { checklistMutations } from './checklist';
import { pipelineLabelMutations } from './label';
import { pipelineMutations } from './pipeline';
import { stageMutations } from './stage';
import { taskMutations } from './task';

export const mutations = {
  ...boardMutations,
  ...pipelineMutations,
  ...stageMutations,
  ...taskMutations,
  ...checklistMutations,
  ...pipelineLabelMutations,
};
