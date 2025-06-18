import { z } from 'zod';

export const replyMessageFormSchema = z.object({
  messages: z.array(
    z.object({
      _id: z.string(),
      type: z.string(),
      buttons: z.array(z.object({})).optional(),
      image: z.string().optional().optional(),
      cards: z.array(z.object({})).optional(),
      quickReplies: z.array(z.object({})).optional(),
      text: z.string().optional(),
      audio: z.string().optional(),
      video: z.string().optional(),
      attachments: z.array(z.any()).optional(),
      input: z.any().optional(),
    }),
  ),
});

export type TMessageActionForm = z.infer<typeof replyMessageFormSchema>;
export type TBotMessage = NonNullable<TMessageActionForm['messages']>[number];
