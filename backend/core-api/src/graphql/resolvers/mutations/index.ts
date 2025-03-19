import { customerMutations } from './customer';
import { brandMutations } from './brand';
import { companyMutations } from './company';
import { configMutations } from './configs';
import { conformityMutations } from './conformities';
import { appMutations } from './app';
import { emailTemplateMutations } from './emailTemplates';
import { exchangeRateMutations } from './exchangeRates';
export default {
  ...appMutations,
  ...brandMutations,
  ...companyMutations,
  ...configMutations,
  ...conformityMutations,
  ...emailTemplateMutations,
  ...customerMutations,
  ...exchangeRateMutations,
};
