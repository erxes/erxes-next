import { z } from 'zod';

export const PIPELINE_CREATE_SCHEMA = z.object({
    name: z.string(),
    visibility: z.string(),
    boardId: z.string(),
    tagId: z.string(),
    departmentIds: z.array(z.string()),
    branchIds: z.array(z.string()),
    memberIds: z.array(z.string()),
    stages: z.array(z.object({
        _id: z.string(),
       age: z.number(),
       code: z.string(),
       canMoveMembers: z.boolean(),
       canEditMembers: z.boolean(),
       color: z.string(),
       name: z.string(),
       probality: z.number(),
       status: z.string(),
       visibility: z.string(),
    })),
});
