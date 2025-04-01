import { nanoid } from 'nanoid';

export const mongoStringRandomId = {
  type: String,
  default: () => nanoid(),
} as const;

/**
 * Allows `null | undefined`.
 * But if it's a `string`, it must contain atleast one non whitespace character.
 */
export const mongoStringNonBlank = {
  type: String,
  validate: /\S+?/,
} as const;

export const mongoStringRequired = {
  type: String,
  required: true,
} as const;

export const mongoStringRequiredNonBlank = {
  type: String,
  validate: /\S+?/,
  required: true,
} as const;
