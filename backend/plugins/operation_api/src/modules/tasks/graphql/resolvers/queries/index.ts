import { boardQueries } from './board';
import { checklistQueries } from './checklist';
import { pipelineLabelQueries } from './label';
import { pipelineQueries } from './pipeline';
import { stageQueries } from './stage';
import { taskQueries } from './task';

export const queries = {
  ...boardQueries,
  ...pipelineQueries,
  ...stageQueries,
  ...taskQueries,
  ...checklistQueries,
  ...pipelineLabelQueries,
};
