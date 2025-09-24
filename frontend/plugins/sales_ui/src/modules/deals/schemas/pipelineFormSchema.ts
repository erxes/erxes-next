import { z } from 'zod';

export const PIPELINE_CREATE_SCHEMA = z.object({
    name: z.string(),
    visibility: z.string().optional(),
    boardId: z.string().optional(),
    tagId: z.string().optional(),
    departmentIds: z.array(z.string()).optional(),
    branchIds: z.array(z.string()).optional(),
    memberIds: z.array(z.string()).optional(),
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
