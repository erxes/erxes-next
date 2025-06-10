import {
  mutations as carMutations,
  queries as carQueries,
  types as carTypes,
} from '~/modules/module/graphql/schemas/cars';

import {
  mutations as carCategoryMutations,
  queries as CarCategoryQueries,
  types as carCategoryTypes,
} from '~/modules/module/graphql/schemas/category';

import { TypeExtensions } from '~/modules/module/graphql/schemas/extension';

export const types = `
  ${TypeExtensions}
  ${carTypes},
  ${carCategoryTypes}
`;

export const queries = `
  ${carQueries},
  ${CarCategoryQueries}
`;

export const mutations = `
  ${carMutations},
  ${carCategoryMutations}
`;

export default { types, queries, mutations };
