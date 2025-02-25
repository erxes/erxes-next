import { BlockNoteSchema, defaultInlineContentSpecs } from '@blocknote/core';

export const BLOCK_SCHEMA = BlockNoteSchema.create({
  inlineContentSpecs: defaultInlineContentSpecs,
});
