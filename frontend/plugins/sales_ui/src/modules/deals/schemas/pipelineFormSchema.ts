import { z } from 'zod';

export const PIPELINE_CREATE_SCHEMA = z.object({
  name: z.string(),
  visibility: z.string(),
  boardId: z.string(),
  tagId: z.string(),
  departmentIds: z.array(z.string()),
  branchIds: z.array(z.string()),
  memberIds: z.array(z.string()),
});
