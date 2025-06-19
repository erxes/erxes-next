import { boardQueries } from './board';
import { checklistQueries } from './checklist';
import { pipelineLabelQueries } from './label';
import { pipelineQueries } from './pipeline';
import { stageQueries } from './stage';
import { ticketQueries } from './ticket';

export const queries = {
  ...boardQueries,
  ...pipelineQueries,
  ...checklistQueries,
  ...pipelineLabelQueries,
  ...stageQueries,
  ...ticketQueries,
};
