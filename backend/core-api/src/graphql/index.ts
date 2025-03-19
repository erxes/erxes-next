import {
  types as ActivityLogTypes,
  queries as ActivityLogQueries,
} from './schema/activityLogs';
import {
  types as RateTypes,
  queries as RateQueries,
  mutations as RateMutations,
} from './schema/exchangeRates';
import {
  types as EmailTemplatesTypes,
  queries as EmailTemplatesQueries,
  mutations as EmailTemplatesMutations,
} from './schema/emailTemplate';
import {
  types as EmailDeliveryTypes,
  queries as EmailDeliveryQueries,
} from './schema/emailDeliveries';
import {
  mutations as CustomerMutations,
  queries as CustomerQueries,
  types as CustomerTypes,
} from './schema/customer';
import {
  types as AppTypes,
  mutations as AppMutations,
  queries as AppQueries,
} from './schema/app';
import {
  mutations as BrandMutations,
  queries as BrandQueries,
  types as BrandTypes,
} from './schema/brand';

import {
  types as CompanyTypes,
  queries as CompanyQueries,
  mutations as CompanyMutations,
} from './schema/company';
import {
  mutations as ConfigMutations,
  queries as ConfigQueries,
  types as ConfigTypes,
} from './schema/config';
import {
  mutations as ConformityMutations,
  types as ConformityTypes,
} from './schema/conformity';
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
  ${ActivityLogTypes}
  ${AppTypes}
  ${BrandTypes}
  ${CompanyTypes}
  ${ConfigTypes}
  ${ConformityTypes}
  ${EmailTemplatesTypes}
  ${EmailDeliveryTypes}
  ${RateTypes}
`;

export const queries = `
  ${CustomerQueries}
  ${RateQueries}
  ${ActivityLogQueries}
  ${AppQueries}
  ${EmailTemplatesQueries}
  ${EmailDeliveryQueries}
  ${BrandQueries}
  ${CompanyQueries}
  ${ConfigQueries}
`;

export const mutations = `
  ${CustomerMutations}
  ${EmailTemplatesMutations}
  ${AppMutations}
  ${BrandMutations}
  ${CompanyMutations}
  ${ConfigMutations}
  ${ConformityMutations}
  ${RateMutations}
`;

export default { types, queries, mutations };
