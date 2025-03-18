import {
  mutations as CustomerMutations,
  queries as CustomerQueries,
  types as CustomerTypes,
} from './schema/customer';

import {
  fieldsTypes as FieldsTypes,
  fieldsQueries as FieldsQueries,
  fieldsMutations as FieldsMutations,
  fieldsGroupsTypes as FieldsGroupsTypes,
  fieldsGroupsQueries as FieldsGroupsQueries,
  fieldsGroupsMutations as FieldsGroupsMutations,
} from './schema/properties';

export const types = `
  scalar JSON
  scalar Date

  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }
  
  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
    inheritMaxAge: Boolean
  ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION

  ${CustomerTypes}
  ${FieldsTypes}
  ${FieldsGroupsTypes}
`;

export const queries = `
  ${CustomerQueries}
  ${FieldsQueries}
  ${FieldsGroupsQueries}
`;

export const mutations = `
  ${CustomerMutations}
  ${FieldsMutations}
  ${FieldsGroupsMutations}
`;

export default { types, queries, mutations };
