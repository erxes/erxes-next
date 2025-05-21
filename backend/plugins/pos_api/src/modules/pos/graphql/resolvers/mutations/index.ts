import posMutations from './pos';
import orderMutations from "./orders";
import coverMutations from './covers';

export default {
  ...posMutations,
  ...orderMutations,
  ...coverMutations,
};
