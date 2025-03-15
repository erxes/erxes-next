import { customerQueries } from './customer';
import { internalNoteQueries } from './internalNote';

export default {
  ...customerQueries,
  ...internalNoteQueries,
};
